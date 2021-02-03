import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CategoryServiceProxy, CreateCategoryInputDto, DDLDto } from 'src/assets/Swagger/SwaggerGenerated';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    parentId: new FormControl(''),
  });
  productDDL: DDLDto[];
  constructor(
    private categoryServiceProxy: CategoryServiceProxy,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getProductDDL();
  }
  getProductDDL() {
    this.categoryServiceProxy.getCategoryDDL().subscribe(
      success => {
        this.productDDL = success
      }
    );
  }
  onSubmit() {
    this.categoryServiceProxy.createCategory({
      name: this.categoryForm.value.name,
      parentId: parseInt(this.categoryForm.value.parentId)
    } as CreateCategoryInputDto).subscribe(
      success => {
        debugger;
        if (success) {
          this.snackBar.open('category Added Successfully!', 'x', {
            duration: 3000
          });
          this.router.navigateByUrl('product/list');
        } else {
          this.snackBar.open('cannot add!', 'x', {
            duration: 3000
          });
        }
      }
    );
  }
  BackToList() {
    this.router.navigateByUrl('product/list');
  }
}
