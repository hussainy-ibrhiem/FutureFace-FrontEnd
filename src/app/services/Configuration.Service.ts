// https://medium.com/bb-tutorials-and-thoughts/angular-how-to-load-settings-data-from-server-before-initializing-an-app-78ea206818ee

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private readonly configUrl = 'assets/settings/app.config.json';
  private configuration$: Configuration;

  constructor(private http: HttpClient) {}

  public load(): Promise<any> {
    // console.log("Start Get Setting");
    return new Promise((resolve, reject) => {
      this.http
        .get<Configuration>(this.configUrl)
        .pipe(shareReplay(1))
        .subscribe((response: any) => {
          this.configuration$ = response;
          resolve(true);
        });
    });
  }

  get settings() {
    return this.configuration$;
  }
}
