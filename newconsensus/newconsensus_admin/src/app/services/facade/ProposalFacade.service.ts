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
import { Proposal } from "../../models/Proposal";
import { ProposalLogs } from "../../models/ProposalLogs";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class ProposalFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public searchLog(searchFilter: SearchFilter): Promise<ProposalLogs[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/log/search';
      let body: any = {}; 
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalLogs[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public pin(body: any, isOverride: boolean): Promise<Proposal> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/pin?override='+isOverride;
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(id: any): Promise<Proposal[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public create(body: Proposal): Promise<Proposal> {
    if (body === undefined || body === null) {
      new Error("body is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal';
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: any, body: Proposal): Promise<Proposal> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (body === undefined || body === null) {
      new Error("body is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + id;
      let options = this.getDefaultOptions();
      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public approve(id: any): Promise<Proposal[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + id + "/approve";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public unapprove(id: any): Promise<Proposal[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + id + "/unapprove";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string): Promise<Proposal> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + id;

      let options = this.getDefaultOptions();
      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Proposal[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
