import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { DebateComment } from "../../models/DebateComment";
import { SearchFilter } from "../../models/SearchFilter";
import { BadWordUtils } from '../../utils/BadWordUtils';

@Injectable()
export class DebateCommentFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(debateId: string, data: DebateComment): Promise<DebateComment> {
    if (debateId === undefined || debateId === null || debateId === '') {
      new Error("debateId is required.");
    }

    if (data === undefined || data === null) {
      new Error("DebateComment is required.");
    }

    // filter
    data.comment = BadWordUtils.clean(data.comment);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + debateId + '/comment';
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(debateId: string, id: string, data: DebateComment): Promise<DebateComment> {
    if (debateId === undefined || debateId === null || debateId === '') {
      new Error("debateId is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    if (data === undefined || data === null) {
      new Error("DebateComment is required.");
    }

    data.id = parseInt(id);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + debateId + '/comment/' + id;
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

  public delete(debateId: string, id: string): Promise<any> {
    if (debateId === undefined || debateId === null || debateId === '') {
      new Error("debateId is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + debateId + '/comment/' + id;
      let options = this.getDefaultOptions();

      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data);
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

  public search(debateId: string, searchFilter: SearchFilter, showUser?: boolean, userLike?: string): Promise<DebateComment[]> {
    if (debateId === undefined || debateId === null || debateId === '') {
      new Error("debateId is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + debateId + '/comment/search';

      if (showUser) {
        url += '?show_user=true';
      }

      if (userLike !== undefined && userLike !== null) {
        let appendOpr = '?';
        if (url.indexOf('show_user') >= 0) {
          appendOpr = '&';
        }
        url += appendOpr + 'user_like=' + userLike;
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as DebateComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public likeDebateComment(debateId: string, id: string, isLike: string): Promise<DebateComment> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/debate/' + debateId + '/comment/' + id + '/like';

      let body: any;

      if (isLike !== null && isLike !== undefined) {
        body = {
          isLike: isLike
        };
      }

      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
  public searchUserDebateComment(searchFilter: SearchFilter, showUser?: boolean): Promise<DebateComment[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/debate/comment/search';
      if (showUser) {
        url += '?show_user=true';
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();
      
      this.http.post(url, body,options).toPromise().then((response: any) => {
        resolve(response.data as DebateComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
