import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'
import { Router } from '@angular/router';

const GCP_IP = environment.GCP_EXTERNAL_IP

@Injectable({providedIn: 'root'})
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getProducts() {
    //this.http.get<{mesage: string, products: Product[]}>('http:localhost:3000/api/v1/products')
    this.http.get<{mesage: string, products: any }>('http://' + GCP_IP + ':3000/api/v1/products')
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

  getProduct(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      description: string,
      price: string }>(
        'http://'+ GCP_IP +':3000/api/v1/products/' + id);
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
        .post<{ message: string, productId: string }>('http://'+ GCP_IP +':3000/api/v1/products', product)
        .subscribe((responseData) => {
          console.log(responseData.message);
          const id = responseData.productId;
          product.id = id;
          this.products.push(product);
          this.productsUpdated.next([...this.products]);
          this.router.navigate(["/"]);
        });
  }

  updateProduct(id: string, title: string, description: string, price: string) {
    const product: Product = {
      id: id,
      title: title,
      description: description,
      price: price
    };
    this.http
      .put('http://'+ GCP_IP +':3000/api/v1/products/' + id, product)
      .subscribe(response => {
        const updatedProducts = [...this.products];
        const oldProductIndex = updatedProducts.findIndex(p => p.id === product.id);
        updatedProducts[oldProductIndex] = product;
        this.products = updatedProducts;
        this.productsUpdated.next([...this.products]);
        this.router.navigate(["/"]);
      });

  }

  deleteProduct(productId: string) {
    this.http.delete('http://'+ GCP_IP +':3000/api/v1/products/' + productId)
      .subscribe(() => {
        console.log('Deleted');
        const updatedProducts = this.products.filter(product => product.id !== productId);
        this.products = updatedProducts;
        this.productsUpdated.next([...this.products]);
      });
  }
}
