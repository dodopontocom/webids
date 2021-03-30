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
  private productsUpdated = new Subject<{ products: Product[], productCount: number}>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getProducts(productsPerPage : number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;

    //this.http.get<{mesage: string, products: Product[]}>('http:localhost:3000/api/v1/products')
    this.http
      .get<{mesage: string, products: any; maxProducts: number }>('http://' + GCP_IP + ':3000/api/v1/products' + queryParams)
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                title: product.title,
                description: product.description,
                price: product.price,
                id: product._id,
                imagePath: product.imagePath
              };
            }),
            maxProducts: productData.maxProducts
          };
        })
      )
      .subscribe((transformedProductData) => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts
        });
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
      price: string,
      imagePath: string }>(
        'http://'+ GCP_IP +':3000/api/v1/products/' + id);
  }

  addProduct(title: string,
    description: string,
    price: string,
    image: File) {
      const productData = new FormData();
      productData.append("title", title);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("image", image, title);
      this.http
        .post<{ message: string, product: Product }>('http://'+ GCP_IP +':3000/api/v1/products', productData)
        .subscribe((responseData) => {
          this.router.navigate(["/"]);
        });
  }

  updateProduct(id: string, title: string, description: string, price: string, image: File | string) {
    let productData: Product | FormData;
    if (typeof(image) === 'object') {
      productData = new FormData();
      productData.append("id", id);
      productData.append("title", title);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("image", image, title);
    } else {
      productData = {
        id: id,
        title: title,
        description: description,
        price: price,
        imagePath: image
      };
    }

    this.http
      .put('http://'+ GCP_IP +':3000/api/v1/products/' + id, productData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });

  }

  deleteProduct(productId: string) {
    return this.http.delete('http://'+ GCP_IP +':3000/api/v1/products/' + productId);
  }
}
