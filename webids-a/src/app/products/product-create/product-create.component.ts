import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-create',
  templateUrl:'./product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  enteredTitle = "";
  enteredContent = "";
  @Output() productCreated = new EventEmitter();

  onAddProduct() {
    const product = {
      content: this.enteredContent,
      title: this.enteredTitle
    };
    this.productCreated.emit(product);
  }
}
