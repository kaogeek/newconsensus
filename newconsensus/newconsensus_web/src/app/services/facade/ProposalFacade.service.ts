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
import { SearchFilter } from "../../models/SearchFilter";
import { BadWordUtils } from '../../utils/BadWordUtils';

@Injectable()
export class ProposalFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(data: Proposal): Promise<Proposal> {
    if (data === undefined || data === null) {
      new Error("Proposal is required.");
    }

    // filter
    data.title = BadWordUtils.clean(data.title);
    // filter
    data.content = BadWordUtils.clean(data.content);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal';
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(id: string, data: Proposal): Promise<Proposal> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }
    if (data === undefined || data === null) {
      new Error("Proposal is required.");
    }

    data.id = parseInt(id);

    // filter
    data.title = BadWordUtils.clean(data.title);
    // filter
    data.content = BadWordUtils.clean(data.content);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + id;
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      }
      let options = this.getDefaultOptions();

      this.http.put(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public find(id: string, userLike?: string): Promise<Proposal> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + id;

      if (userLike) {
        url += '?user_like=' + userLike;
      }

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter, showUser?: boolean, showComment?: boolean, approveMode?: string, showDebate?: boolean): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/search';

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

      if (approveMode) {
        if (url.indexOf('?')) {
          url += '&';
        } else {
          url += '?';
        }
        url += 'approve_mode=' + approveMode;
      }

      if (showDebate) {
        if (url.indexOf('?')) {
          url += '&';
        } else {
          url += '?';
        }
        url += 'show_debate=true';
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchHot(count: boolean, roomId?: number, offset?: number, limit?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/search/hot';

      if (roomId !== undefined && roomId !== null) {
        url += '?room_id=' + roomId;
      }
      if (offset !== undefined && offset !== null) {
        if (url.indexOf('room_id') >= 0) {
          url += '&offset=' + offset;
        } else {
          url += '?offset=' + offset;
        }
      }
      if (count !== undefined && count !== null) {
        if (url.indexOf('room_id') >= 0 || url.indexOf('offset') >= 0) {
          url += '&count=' + count;
        } else {
          url += '?count=' + count;
        }
      }

      if (limit !== undefined && limit !== null) {
        if (url.indexOf('room_id') >= 0 || url.indexOf('offset') >= 0 || url.indexOf('count') >= 0) {
          url += '&limit=' + limit;
        } else {
          url += '?limit=' + limit;
        }
      }

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public supportProposal(proposalId: string): Promise<Proposal> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/support';
      let body: any = {};
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getCurrentUserSupportProposal(proposalId: string): Promise<any> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("ProposalId is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/support';
      let options = this.getDefaultOptions();

      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getRelateProposal(proposalID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/relatetag/proposal?content_id=' + proposalID;
      let options = this.getDefaultOptions();

      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public likeProposal(id: string, islike: boolean): Promise<any> {
    if (id === undefined || id === null || id === '') {
      return Promise.reject('Proposal Id is required.');
    }

    if (islike === undefined || islike === null) {
      return Promise.reject('Like/Dislike Value is required.');
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + id + '/like';
      let body: any = {
        isLike: (islike ? 'true' : 'false')
      };
      body = Object.assign(body);

      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Proposal);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
