import { Component, EventEmitter, Output } from '@angular/core';

import { Product } from '../product.model'

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

  onAddProduct() {
    const product: Product = {
      title: this.enteredTitle,
      description: this.enteredDescription,
      price: this.enteredPrice
    };
    this.productCreated.emit(product);
  }
}
