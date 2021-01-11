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
import { Debate } from "../../models/Debate";
import { SearchFilter } from "../../models/SearchFilter";
import { BadWordUtils } from '../../utils/BadWordUtils';

@Injectable()
export class DebateFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(data: Debate): Promise<Debate> {
    if (data === undefined || data === null) {
      new Error("Debate is required.");
    }

    // filter
    data.title = BadWordUtils.clean(data.title);
    // filter
    data.content = BadWordUtils.clean(data.content);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate';
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data);
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Debate);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: string, data: Debate): Promise<Debate> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }
    if (data === undefined || data === null) {
      new Error("Debate is required.");
    }

    data.id = parseInt(id);

    // filter
    data.title = BadWordUtils.clean(data.title);
    // filter
    data.content = BadWordUtils.clean(data.content);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + id;
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data);
      }
      let options = this.getDefaultOptions();

      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string, userLike?: string): Promise<any> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + id;

      if (userLike) {
        url += '?user_like='+userLike;
      }

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter, showUser?: boolean, showComment?: boolean): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/search';

      if (showUser) {
        url += '?show_user=true';
      }

      if (showComment) {
        if (url.endsWith('search')) {
          url += '?';
        } else {
          url += '&';
        }
        url += 'show_comment=true';
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter);
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchHot(limit?: number, offset?: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/search/hot';

      if (limit !== undefined && limit !== null) {
        url += '?limit=' + limit;
      }

      if (offset !== undefined && offset !== null) {
        if (url.indexOf("liiit") >= 0) {
          url += '&offset=' + offset; 
        } else {
          url += '?offset=' + offset;
        }
      }

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public countHot(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/search/hot?count=true';

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public likeDebate(id: string, islike: boolean): Promise<any> {
    if(id === undefined || id === null || id === ''){
      return Promise.reject('Debate Id is required.');
    }

    if(islike === undefined || islike === null){
      return Promise.reject('Like/Dislike Value is required.');
    }

    return new Promise((resolve, reject) =>{
      let url: string = this.baseURL + '/debate/'+id+'/like';
      let body: any = {
        isLike: (islike ? 'true' : 'false')
      };
      body = Object.assign(body);

      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Debate);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
