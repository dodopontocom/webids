import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'
import { Router } from '@angular/router';

const API_HOST = environment.API_TESTING_HOST + "/products/";
const GCP_BUCKET_URL = environment.GCLOUD_APP_BUCKET;

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
      .get<{mesage: string, products: any; maxProducts: number }>(API_HOST + queryParams)
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                title: product.title,
                description: product.description,
                price: product.price,
                id: product._id,
                imagePath: GCP_BUCKET_URL + product.imagePath,
                creator: product.creator
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
      creator: string,
      imagePath: string }>(
        API_HOST + id);
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
        .post<{ message: string, product: Product }>(API_HOST, productData)
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
        imagePath: image,
        creator: null
      };
    }

    this.http
      .put(API_HOST + id, productData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });

  }

  deleteProduct(productId: string) {
    return this.http.delete(API_HOST + productId);
  }
}
