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

  public create(voteId: string, data: VoteComment): Promise<VoteComment> {
    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote Id is required.");
    }

    if (data === undefined || data === null) {
      new Error("Vote Comment is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + voteId + '/comment';
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as VoteComment);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public update(voteId: string, id: number, data: VoteComment): Promise<VoteComment> {
    if (voteId === undefined || voteId === null) {
      new Error("Vote Id is required.");
    }

    if (id === undefined || id === null) {
      new Error("Id is required.");
    }

    if (data === undefined || data === null) {
      new Error("Vote Comment is required.");
    }
    try {
      data.id = id;
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + voteId + '/comment/' + id;
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

  public delete(voteId: string, id: string): Promise<VoteComment> {
    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote Id is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + voteId + '/comment/' + id;

      let options = this.getDefaultOptions();

      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data);
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
      let url: string = this.baseURL + '/vote/' + voteId + '/comment/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(voteId: string, searchFilter: SearchFilter, showUser?: boolean): Promise<VoteComment[]> {
    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + voteId + '/comment/search';

      if (showUser) {
        url += '?show_user=true';
      }

      let body: any = {};

      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as VoteComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public like(id: string, voteId: string, isLike: string): Promise<VoteComment> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + voteId + '/comment/' + id + '/like';

      let body: any = {
        "isLike": isLike
      };
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public deleteLike(id: string, voteId: string): Promise<VoteComment> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    if (voteId === undefined || voteId === null || voteId === '') {
      new Error("Vote is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + voteId + '/comment/' + id + '/like';

      this.http.delete(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchUserVoteComment(searchFilter: SearchFilter, showUser?: boolean): Promise<VoteComment[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/vote/comment/search';

      if (showUser) {
        url += '?show_user=true';
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body,options).toPromise().then((response: any) => {
        resolve(response.data as VoteComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
