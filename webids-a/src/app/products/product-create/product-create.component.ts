import { Component, Output } from '@angular/core';

import { NgForm } from '@angular/forms';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-create',
  templateUrl:'./product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  enteredTitle = "";
  enteredDescription = "";
  enteredPrice = "";

  constructor(public productsService: ProductsService){

  }

  onAddProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.productsService.addProduct(form.value.title,
      form.value.description,
      form.value.price);
    form.resetForm();
  }
}
