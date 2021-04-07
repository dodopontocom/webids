import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy{

  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userId: string;
  private productsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public productsService: ProductsService, private authService: AuthService) {

  }

  ngOnInit(){
    this.isLoading = true;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSub = this.productsService.getProductsUpdatedListener()
      .subscribe((productData: {products: Product[], productCount: number}) => {
        this.isLoading = false;
        this.totalProducts = productData.productCount;
        this.products = productData.products;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });

  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
