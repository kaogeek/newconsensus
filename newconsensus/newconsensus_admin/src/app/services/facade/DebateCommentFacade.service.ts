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
import { DebateComment } from "../../models/DebateComment";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class DebateCommentFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public delete(debateId: string, id: any): Promise<DebateComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (debateId === undefined || debateId === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/' + debateId + '/comment/' + id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(debateId: string, id: string): Promise<DebateComment> {
    if (debateId === undefined || debateId === null || debateId === '') {
      new Error("debateId is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + debateId + '/comment/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(debateId: any, searchFilter: SearchFilter): Promise<DebateComment[]> {
    if (debateId === undefined || debateId === null) {
      new Error("debateId is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/' + debateId + '/comment/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public approve(debateId: any , id: any): Promise<DebateComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/' + debateId + '/comment/' + id + "/approve";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public unapprove(debateId: any , id: any): Promise<DebateComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/debate/' + debateId + '/comment/' + id + "/unapprove";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }


}
