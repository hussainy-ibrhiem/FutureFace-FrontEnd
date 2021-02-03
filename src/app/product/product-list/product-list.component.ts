import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductDto, ProductIDentityDto, ProductSearchDto, ProductsServiceProxy } from 'src/assets/Swagger/SwaggerGenerated';
import { MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { SortDirectionEnum } from 'src/app/shared/Enums';
import { ExcelService } from 'src/app/services/ExcelService';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  resultLength = 0;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['name', 'price', 'photo', 'Quantity', 'SubCategoryName', 'CategoryName', 'symbol'];
  productList: ProductDto[];
  searchData = {
    name: '',
    pageNumber: 1,
    pageSize: 5,
    sortingModel: {
      sortingDirection: 0,
      sortingExpression: ''
    }
  } as ProductSearchDto;

  searchForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(
    private productsServiceProxy: ProductsServiceProxy,
    private router: Router,
    private snackBar: MatSnackBar,
    private excelService: ExcelService
  ) { }
  ngAfterViewInit(): void {
    this.loadData();
  }

  ngOnInit() {
  }

  prepareSearchObject() {
    this.searchData.name = this.searchForm.value.name;
    this.searchData.pageNumber = this.paginator.pageIndex + 1;
    this.searchData.pageSize = this.paginator.pageSize;
    this.searchData.sortingModel.sortingExpression = this.sort.active;
    if (this.sort.direction === 'desc') {
      this.searchData.sortingModel.sortingDirection = SortDirectionEnum.Descending as number;
    } else {
      this.searchData.sortingModel.sortingDirection = SortDirectionEnum.Ascending as number;
    }
  }
  loadData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.prepareSearchObject();
          return this.productsServiceProxy.getAll(this.searchData);
        }),
        map(data => {
          this.resultLength = data.totalCount;
          return data.dataList;
        },
          catchError(() => {
            return observableOf([]);
          }))
      ).subscribe((data) => { this.productList = data;  });
  }
  ToCreate() {
    this.router.navigateByUrl('product/add');
  }
  Edit(productId: number) {
    this.router.navigateByUrl('product/edit?id=' + productId);
  }
  Delete(productId: number) {
    this.productsServiceProxy.deleteProduct({ id: productId } as ProductIDentityDto).subscribe(
      success => {
        if (success) {
          this.snackBar.open('Product Deleted Successfully!', 'x', {
            duration: 3000
          });
          this.loadData();
        } else {
          this.snackBar.open('cannot delete!', 'x', {
            duration: 3000
          });
        }
      }
    )
  }
  ResetFrom() {
    this.searchForm.controls.name.setValue('');
    this.loadData();
  }
  goToAddCategory(): void {
    this.router.navigateByUrl('category/add');
  }
}
