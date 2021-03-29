import { Component, Output, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-create',
  templateUrl:'./product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  enteredTitle = "";
  enteredDescription = "";
  enteredPrice = "";
  product: Product;
  isLoading = false;
  form: FormGroup;

  private mode = "create";
  private productId: string;

  constructor(public productsService: ProductsService, public route: ActivatedRoute){

  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      description: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      price: new FormControl(null, {validators: [Validators.required]}),
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
            price: productData.price
          };
          this.form.setValue({
            title: this.product.title,
            description: this.product.description,
            price: this.product.price
          });
        });
      } else {
        this.mode = "create";
        this.productId = null;
      }
    });
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
        this.form.value.price);
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.price
      );
    }
    this.form.reset();
  }
}
