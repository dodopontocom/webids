import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http: HttpClient) {

  }

  getProducts() {
    //this.http.get<{mesage: string, products: Product[]}>('http:localhost:3000/api/products')
    this.http.get<{mesage: string, products: any }>('http://35.226.103.232:3000/api/products')
      .pipe(map((productData) => {
        return productData.products.map(product => {
          return {
            title: product.title,
            description: product.description,
            price: product.price,
            id: product._id
          };
        });
      }))
      .subscribe((transformedProducts) => {
        this.products = transformedProducts;
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
        .post<{ message: string, productId: string }>('http://35.226.103.232:3000/api/products', product)
        .subscribe((responseData) => {
          console.log(responseData.message);
          const id = responseData.productId;
          product.id = id;
          this.products.push(product);
          this.productsUpdated.next([...this.products]);
        });
  }

  deleteProduct(productId: string) {
    this.http.delete('http://35.226.103.232:3000/api/products/' + productId)
      .subscribe(() => {
        console.log('Deleted');
        const updatedProducts = this.products.filter(product => product.id !== productId);
        this.products = updatedProducts;
        this.productsUpdated.next([...this.products]);
      });
  }
}
