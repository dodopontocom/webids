import { Component, Output, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
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

  private mode = "create";
  private productId: string;

  constructor(public productsService: ProductsService, public route: ActivatedRoute){

  }

  ngOnInit() {
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
        });
      } else {
        this.mode = "create";
        this.productId = null;
      }
    });
  }

  onSaveProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(form.value.title,
        form.value.description,
        form.value.price);
    } else {
      this.productsService.updateProduct(this.productId,
        form.value.title,
        form.value.description,
        form.value.price
      );
    }
    form.resetForm();
  }
}
