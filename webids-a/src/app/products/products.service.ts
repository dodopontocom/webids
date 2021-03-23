import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http: HttpClient) {

  }

  getProducts() {
    //this.http.get<{mesage: string, products: Product[]}>('http:localhost:3000/api/products')
    this.http.get<{mesage: string, products: Product[]}>('http://localhost:3000/api/products')
      .subscribe((productData) => {
        this.products = productData.products;
        this.productsUpdated.next([...this.products]);
      });
  }

  getProductsUpdatedListener() {
    return this.productsUpdated.asObservable();
  }

  addProduct(title: string,
    description: string,
    price: string) {
      const product: Product = {
        id: null,
        title: title,
        description: description,
        price: price
      };
      this.http
        .post<{ message: string }>('http://localhost:3000/api/products', product)
        .subscribe((responseData) => {
          console.log(responseData.message);
          this.products.push(product);
          this.productsUpdated.next([...this.products]);
        });
    }
}
