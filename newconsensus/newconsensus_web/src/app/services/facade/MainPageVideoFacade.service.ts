import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { SearchFilter } from "../../models/SearchFilter";
import { MainPageVideo } from 'src/app/models/MainPageVideo';

@Injectable()
export class MainPageVideoFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public search(searchFilter: SearchFilter): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pagevideo/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as MainPageVideo[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
