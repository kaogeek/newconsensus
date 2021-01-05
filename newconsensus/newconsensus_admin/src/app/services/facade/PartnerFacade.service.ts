import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { Partner } from "../../models/Partner";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class PartnerFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(body: Partner): Promise<Partner> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/partner';
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: any, body: Partner): Promise<Partner> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/partner/' + id;
      let options = this.getDefaultOptions();
      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(id: any): Promise<Partner[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/partner/'+id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as Partner[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string): Promise<Partner> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/partner/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Partner[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/partner/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Partner[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
