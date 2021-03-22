import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy{

  products: Product[] = [];
  private productsSub: Subscription;

  constructor(public productsService: ProductsService) {

  }

  ngOnInit(){
    this.productsService.getProducts();
    this.productsSub = this.productsService.getProductsUpdatedListener()
      .subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }

}
