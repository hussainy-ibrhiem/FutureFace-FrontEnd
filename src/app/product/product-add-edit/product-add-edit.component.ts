import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFile } from 'src/app/services/upload-file.service';
import { AddEditProductInputDto, CategoryServiceProxy, DDLDto, GetCategoryByParentIdInputDto, ProductIDentityDto, ProductsServiceProxy } from 'src/assets/Swagger/SwaggerGenerated';
import { DomSanitizer } from '@angular/platform-browser';
export interface ImageInfo {
  imageUrl: string;
  imageName: string;
  imageExtention: string;
  imageSize: string;
}
@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrls: ['./product-add-edit.component.css']
})
export class ProductAddEditComponent implements OnInit, AfterViewInit {
  imageUrl = '';
  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    parentId: new FormControl('', Validators.required),
    subParentId: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
  });
  id = 0;
  private file: File;
  imageInfo: ImageInfo = {
    imageUrl: '',
    imageExtention: '',
    imageName: '',
    imageSize: '',
  };
  categoryDDL: DDLDto[];
  subcategoryDDL: DDLDto[];
  constructor(
    private productsServiceProxy: ProductsServiceProxy,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private uploadFile: UploadFile,
    private DomSanitizer: DomSanitizer,
    private categoryServiceProxy: CategoryServiceProxy,

  ) { 
  }
  ngAfterViewInit(): void {
  }
  
  ngOnInit() {
    this.getData();
  }
  getProductDDL() {
    this.categoryServiceProxy.getCategoryDDL().subscribe(
      success => {
        this.categoryDDL = success
      }
    );
  }
  getSubCategoryDDL(id: number) {
    this.categoryServiceProxy.getCategoryByParentIdDDl({ parentId: id } as GetCategoryByParentIdInputDto).subscribe(
      success => {
        this.subcategoryDDL = success;
      }
    );
  }
  getData() {
    this.getProductDDL();
    this.activatedRoute.queryParams.subscribe(
      param => {
        if (param.id) {
          this.id = parseInt(param.id);
          this.productsServiceProxy.getProductById({ id: this.id } as ProductIDentityDto).subscribe(
            success => {
              this.productForm.patchValue({
                name: success.name,
                price: success.price,
                quantity: success.quantity,
                parentId:success.categoryId
              });
              this.getSubCategoryDDL(success.categoryId);
              this.productForm.controls.subParentId.setValue(success.subCategoryId);

              this.imageUrl = success.photo;
            }
          );
        }
      }
    )
  }
  onSubmit() {
    debugger;
    if (this.id === 0) {
      this.productsServiceProxy.addProduct({
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        categoryId: parseInt(this.productForm.value.parentId),
        subCategoryId: parseInt(this.productForm.value.subParentId),
        photo: this.imageUrl
      } as AddEditProductInputDto).subscribe(
        success => {
          if (success) {
            this.snackBar.open('Product Added Successfully!', 'x', {
              duration: 3000
            });
            this.router.navigateByUrl('product/list');
          } else {
            this.snackBar.open('cannot add!', 'x', {
              duration: 3000
            });
          }
        }
      )
    } else {
      this.productsServiceProxy.updateProduct({
        id: this.id,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        categoryId: parseInt(this.productForm.value.parentId),
        subCategoryId: parseInt(this.productForm.value.subParentId),
        photo: this.imageUrl
      } as AddEditProductInputDto).subscribe(
        success => {
          if (success) {
            this.snackBar.open('Product Updated Successfully!', 'x', {
              duration: 3000
            });
            this.router.navigateByUrl('product/list');
          } else {
            this.snackBar.open('cannot update!', 'x', {
              duration: 3000
            });
          }
        }
      )
    }
  }
  processDataFile(fileInput: any) {
    this.file = fileInput.files[0];
    if (this.file !== null) {
      // this.imageRemoved = false;
      this.imageInfo.imageName = this.file.name;
      this.imageInfo.imageExtention = this.file.type;
      const size = this.file.size / Math.log(1024);
      this.imageInfo.imageSize = Math.round(size).toString() + ' KB';
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageInfo.imageUrl = reader.result.toString();
      };
      this.uploadFile.UploadProductImage(this.file).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
          }
          if (event.type === HttpEventType.Response) {
            this.imageUrl = event.body.fileName;
          }
        }
      );
    }
  }
  BackToList() {
    this.router.navigateByUrl('product/list');
  }
}
