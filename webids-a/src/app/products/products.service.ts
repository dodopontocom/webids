import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  getProducts() {
    return [...this.products];
  }

  getProductsUpdatedListener() {
    return this.productsUpdated.asObservable();
  }

  addProduct(title: string,
    description: string,
    price: string) {
      const product: Product = {
        title: title,
        description: description,
        price: price
      };
      this.products.push(product);
      this.productsUpdated.next([...this.products]);
    }
}
