import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFile {
  constructor(
    private http: HttpClient
    ) {
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
      'https://localhost:44326/api/Products/UploadImage' ,
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
