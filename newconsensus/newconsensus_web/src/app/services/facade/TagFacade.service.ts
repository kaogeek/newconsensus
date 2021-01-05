import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { Tag } from "../../models/Tag";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class TagFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public find(id: string): Promise<Tag> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/tag/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Tag[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/tag/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as Tag[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public tagContentDetails(id: string): Promise<Tag[]> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/tag/' + id + '/content';

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
