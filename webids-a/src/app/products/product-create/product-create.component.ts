import { Component, EventEmitter, Output } from '@angular/core';

import { Product } from '../product.model'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl:'./product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  enteredTitle = "";
  enteredDescription = "";
  enteredPrice = "";
  @Output() productCreated = new EventEmitter();

  onAddProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const product: Product = {
      title: form.value.title,
      description: form.value.description,
      price: form.value.price
    };
    this.productCreated.emit(product);
  }
}
