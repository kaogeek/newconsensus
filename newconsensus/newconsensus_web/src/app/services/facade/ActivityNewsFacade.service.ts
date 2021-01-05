import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { SearchFilter } from "../../models/SearchFilter";
import { ActivityNews } from 'src/app/models/ActivityNews';
import { throwError } from 'rxjs';

@Injectable()
export class ActivityNewsFacade  extends AbstractFacade {
    constructor(http: HttpClient, authMgr: AuthenManager) {
        super(http, authMgr);
      }

      public search(searchFilter: SearchFilter): Promise<any[]> {
        return new Promise((resolve, reject) => {
          let url: string = this.baseURL + '/activity/search';
          let body: any = {};
          if (searchFilter !== null && searchFilter !== undefined) {
            body = Object.assign(searchFilter)
          }
    
          this.http.post(url, body).toPromise().then((response: any) => {
            resolve(response.data as ActivityNews[]);
          }).catch((error: any) => {
            reject(error);
          });
        });
      }

      public find(id: string): Promise<any[]> {
        if (id === undefined || id === null ) {
          throwError("required id")
        }
        return new Promise((resolve, reject) => {
          let url: string = this.baseURL + '/activity/'+id;
    
          this.http.get(url).toPromise().then((response: any) => {
            resolve(response.data as ActivityNews[]);
          }).catch((error: any) => {
            reject(error);
          });
        });
      }
}
