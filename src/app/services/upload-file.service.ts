import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from './Configuration.Service';

@Injectable({
  providedIn: 'root',
})
export class UploadFile {
  private configuration$: Configuration;
  constructor(
    private http: HttpClient,
    private config: ConfigurationService
    ) {
    this.configuration$ = this.config.settings;
  }
 
  UploadProductImage(
    files: File
  ): Observable<HttpEvent<UploadFileResponse>> {
    return this.uploadFile(files);
  }
  
  private uploadFile(
    files: File
  ): Observable<HttpEvent<UploadFileResponse>> {
    const formData = new FormData();
    formData.append('file', files);
    const uploadReq = new HttpRequest(
      'POST',
      this.configuration$.BaseURL+'/api/Products/UploadImage' ,
      formData,
      {
        reportProgress: false,
      }
    );
    return this.http.request<UploadFileResponse>(uploadReq);
  }

}
export interface UploadFileResponse {
  fileName: string;
  url?: string;
}
