import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './shared/AppConfigService';
import { API_BASE_URL, CategoryServiceProxy, ProductsServiceProxy } from 'src/assets/Swagger/SwaggerGenerated';
import { ProductAddEditComponent } from './product/product-add-edit/product-add-edit.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MatTableModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatSortModule,
  MatSelectModule,
  MatRadioModule,
  MatTreeModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatIconModule,
  MatTabsModule,
  MatCheckboxModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ExcelService } from './services/ExcelService';
import { UploadFile } from './services/upload-file.service';
import { ConfigurationService } from './services/Configuration.Service';
import { AddCategoryComponent } from './add-category/add-category.component';

const matmodules = [
  MatFormFieldModule,
  MatTableModule,
  MatPaginatorModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatSortModule,
  MatSelectModule,
  MatRadioModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatTreeModule,
  MatIconModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatIconModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatIconModule,
  MatTabsModule,
  MatDialogModule,
];
export function getApiBaseUrl(): string {
  return AppConfigService.appConfig.BaseURL;
}
@NgModule({
  declarations: [
    AppComponent,
    ProductAddEditComponent,
    ProductListComponent,
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ...matmodules,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigurationService) => () =>
        configService.load(),
      deps: [ConfigurationService],
      multi: true,
    },
    { provide: API_BASE_URL, useFactory: getApiBaseUrl },
    ProductsServiceProxy,
    CategoryServiceProxy,
    HttpClientModule,
    ExcelService,
    UploadFile
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
