import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade"; 
import { SearchFilter } from '../../models/SearchFilter';
import { PageUser } from '../../models/PageUser';

@Injectable()
export class PageUserFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  } 

  public search(searchFilter: SearchFilter): Promise<PageUser[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as any[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public official(id: string | number): Promise<PageUser> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/official/' + id;

      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public unofficial(id: string | number): Promise<PageUser> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/unofficial/' + id;

      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public ban(id: string | number): Promise<PageUser> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/ban/' + id;

      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public unban(id: string | number): Promise<PageUser> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    } 
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/unban/' + id;

      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
