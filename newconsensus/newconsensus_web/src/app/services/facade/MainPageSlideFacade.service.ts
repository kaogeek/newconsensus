import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { SearchFilter } from "../../models/SearchFilter";
import { MainPageSlide } from 'src/app/models/MainPageSlide';

@Injectable()
export class MainPageSlideFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public search(searchFilter: SearchFilter): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageslide/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as MainPageSlide[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
