/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

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

  public create(body: Tag): Promise<Tag> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/tag';

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: any, body: Tag): Promise<Tag> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (body === undefined || body === null) {
      new Error("body is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/tag/' + id;

      let options = this.getDefaultOptions();
      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(id: any): Promise<Tag[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/tag/'+id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as Tag[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
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
      let url: string = this.baseURL + '/admin/tag/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
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
