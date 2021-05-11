
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './globalService';

@Injectable()
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {
  }

  public getConfig(key: any) {
    return this.config[key];
  }

  loadAppConfig() {
    return this.http.get('./assets/app-Config.json')
      .toPromise()
      .then(data => {
        this.config = data;
        Globals.setGlobals(this.config);
      });
  }
}
