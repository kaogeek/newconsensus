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
import { VoteComment } from "../../models/VoteComment";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class VoteCommentFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public delete(voteId: string, id: any): Promise<VoteComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (voteId === undefined || voteId === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/' + voteId + '/comment/' + id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as VoteComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(voteId: string, id: string): Promise<VoteComment> {
    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote Id is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/' + voteId + '/comment/' + id;

      let options = this.getDefaultOptions();
      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(voteId: string, searchFilter: SearchFilter): Promise<VoteComment[]> {
    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/' + voteId + '/comment/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as VoteComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public approve(voteId: any , id: any): Promise<VoteComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/' + voteId + '/comment/' + id + "/approve";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as VoteComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public unapprove(voteId: any , id: any): Promise<VoteComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/vote/' + voteId + '/comment/' + id + "/unapprove";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as VoteComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
