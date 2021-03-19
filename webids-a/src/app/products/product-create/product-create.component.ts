import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-create',
  templateUrl:'./product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  enteredTitle = "";
  enteredDescription = "";
  @Output() productCreated = new EventEmitter();

  onAddProduct() {
    const product = {
      description: this.enteredDescription,
      title: this.enteredTitle
    };
    this.productCreated.emit(product);
  }
}
