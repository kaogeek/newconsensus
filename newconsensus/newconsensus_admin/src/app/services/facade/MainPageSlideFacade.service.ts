import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { SearchFilter } from "../../models/SearchFilter";
import { MainPageSlideLogs } from "../../models/MainPageSlideLogs";
import { PageSlide } from '../../models/PageSlide';

@Injectable()
export class MainPageSlideFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public searchLog(searchFilter: SearchFilter): Promise<MainPageSlideLogs[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/pageslide/log/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as MainPageSlideLogs[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(id: any): Promise<PageSlide[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/pageslide/' + id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as PageSlide[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public create(body: PageSlide): Promise<PageSlide> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/pageslide';

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public ordering(body: any): Promise<PageSlide[]> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/pageslide/ordering';

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: any, body: PageSlide): Promise<PageSlide> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (body === undefined || body === null) {
      new Error("body is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/pageslide/' + id;

      let options = this.getDefaultOptions();
      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string): Promise<PageSlide> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageslide/' + id;

      let options = this.getDefaultOptions();
      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<PageSlide[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageslide/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as PageSlide[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
