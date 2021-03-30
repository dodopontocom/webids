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

  getProducts(productsPerPage : number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;

    //this.http.get<{mesage: string, products: Product[]}>('http:localhost:3000/api/v1/products')
    this.http.get<{mesage: string, products: any }>('http://' + GCP_IP + ':3000/api/v1/products' + queryParams)
      .pipe(map((productData) => {
        return productData.products.map(product => {
          return {
            title: product.title,
            description: product.description,
            price: product.price,
            id: product._id,
            imagePath: product.imagePath
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
          const product: Product = {
            id: responseData.product.id,
            title: title,
            description: description,
            price: price,
            imagePath: responseData.product.imagePath
          };
          console.log(responseData.message);
          this.products.push(product);
          this.productsUpdated.next([...this.products]);
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
        const updatedProducts = [...this.products];
        const oldProductIndex = updatedProducts.findIndex(p => p.id === id);
        const product: Product = {
          id: id,
          title: title,
          description: description,
          price: price,
          imagePath: ""
        };
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
