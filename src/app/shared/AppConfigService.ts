import { Injectable } from '@angular/core';

export interface AppConfig {
  BaseURL: string;
  ApiBaseUrl: string;
  ApiWorkflowBaseUrl: string;
}
@Injectable({ providedIn: 'root' })
export class AppConfigService<T extends AppConfig = AppConfig> {
  public static appConfig: AppConfig;

  constructor() { }

  static loadConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', (resp) => {
        if (oReq.status === 200) {
          try {
            AppConfigService.appConfig = JSON.parse(oReq.responseText);
          } catch (e) {
            reject(e);
          }
          resolve();
        } else {
          reject(oReq.statusText);
        }
      });

      oReq.open('GET', './assets/settings/app.config.json');
      oReq.send();
    });
  }

  getConfig(): T {
    return AppConfigService.appConfig as T;
  }
}
