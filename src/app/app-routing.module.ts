import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ProductAddEditComponent } from './product/product-add-edit/product-add-edit.component';
import { ProductListComponent } from './product/product-list/product-list.component';


const routes: Routes = [
  {
    path: 'product/list',
    component: ProductListComponent
  },
  {
    path: 'product/add',
    component: ProductAddEditComponent
  },
  {
    path: 'product/edit',
    component: ProductAddEditComponent
  }, 
  {
    path: 'category/add',
    component: AddCategoryComponent
  }, 
  {
    path: "",
    redirectTo: "product/list",
    pathMatch: "full",
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
