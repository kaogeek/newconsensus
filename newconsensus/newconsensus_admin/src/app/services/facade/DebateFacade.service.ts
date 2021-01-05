import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { Debate } from "../../models/Debate";
import { DebateLogs } from "../../models/DebateLogs";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class DebateFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public searchLog(searchFilter: SearchFilter): Promise<DebateLogs[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/log/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as DebateLogs[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public pin(body: any, isOverride: boolean): Promise<Debate> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/pin?override='+isOverride;
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Debate);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(id: any): Promise<Debate> {
    if (id === undefined || id === null) {
      new Error("id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/'+id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as Debate);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string): Promise<Debate> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Debate[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Debate[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
