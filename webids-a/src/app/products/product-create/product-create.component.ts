import { Component, Output, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../product.model';
import { mimeType } from './mime-type.validator'
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-create',
  templateUrl:'./product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredDescription = "";
  enteredPrice = "";
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private mode = "create";
  private productId: string;

  private authStatusSub: Subscription;

  constructor(public productsService: ProductsService, public route: ActivatedRoute, private authService: AuthService){

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      description: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      price: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null,{ validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = "edit";
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {id: productData._id,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            imagePath: productData.imagePath,
            creator: productData.creator
          };
          this.form.setValue({
            title: this.product.title,
            description: this.product.description,
            price: this.product.price,
            image: this.product.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.productId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    console.log(file);
    console.log(this.form);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.image);
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
