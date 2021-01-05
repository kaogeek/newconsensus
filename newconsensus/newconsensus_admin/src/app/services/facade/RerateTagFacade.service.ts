import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { RerateTag } from "../../models/RerateTag";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class RerateTagFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(body: RerateTag): Promise<RerateTag> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/relatetag';

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(name: any, body: RerateTag): Promise<RerateTag> {
    if (name === undefined || name === null) {
      new Error("Name is required.");
    }
    if (body === undefined || body === null) {
      new Error("body is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/relatetag/' + name;

      let options = this.getDefaultOptions();
      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(name: any): Promise<RerateTag[]> {
    if (name === undefined || name === null) {
      new Error("Name is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/relatetag/'+name;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as RerateTag[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(name: string): Promise<RerateTag> {
    if (name === undefined || name === null || name === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/relatetag/' + name;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<RerateTag[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/relatetag/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as RerateTag[]);
        console.log('response',response)
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
