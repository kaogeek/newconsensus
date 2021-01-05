import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { Vote } from "../../models/Vote";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class VoteFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(body: Vote): Promise<Vote> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote';
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: any, body: Vote): Promise<Vote> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (body === undefined || body === null) {
      new Error("body is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/' + id;
      let options = this.getDefaultOptions();
      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string): Promise<Vote> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Vote[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();
      this.http.post<any>(url, body, options);
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Vote[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(id: any): Promise<Vote[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/'+id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as Vote[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
