import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { PageContent } from "../../models/PageContent";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class PageContentFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr); 
  }

  public pageContentDetails(id: string): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/content/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter, showImage?: boolean): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/content/search';

      if (showImage) {
        url += '?show_image=true';
      } else {
        url += '?show_image=false';
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as PageContent[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }


  public contentView(id: string): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/content/' + id + '/count';

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
