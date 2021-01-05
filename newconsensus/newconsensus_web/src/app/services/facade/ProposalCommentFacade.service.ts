import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { ProposalComment } from "../../models/ProposalComment";
import { SearchFilter } from "../../models/SearchFilter";
import { BadWordUtils } from '../../utils/BadWordUtils';

@Injectable()
export class ProposalCommentFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public create(proposalId: string, data: ProposalComment): Promise<ProposalComment> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Proposal Id is required.");
    }

    if (data === undefined || data === null) {
      new Error("Proposal Comment is required.");
    }

    // filter
    data.comment = BadWordUtils.clean(data.comment);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/comment';
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public edit(proposalId: string, id: string, data: ProposalComment): Promise<ProposalComment> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Proposal Id is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    if (data === undefined || data === null) {
      new Error("Proposal Comment is required.");
    }

    data.id = parseInt(id);

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/comment/' + id;
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

  public find(proposalId: string, id: string): Promise<ProposalComment> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Proposal Id is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/comment/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(proposalId: string, searchFilter: SearchFilter, showUser?: boolean, userLike?: string): Promise<ProposalComment[]> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Proposal Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/comment/search';
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
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public like(proposalId: string, commentId: string, isLike: boolean): Promise<ProposalComment> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Proposal Id is required.");
    }

    if (commentId === undefined || commentId === null || commentId === '') {
      new Error("Proposal Comment Id is required.");
    }

    if (isLike === undefined || isLike === null) {
      new Error("Proposal Comment Like/Dislike is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/comment/' + commentId + '/like';
      let body: any = {
        isLike: isLike
      };

      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchUserProposalComment(searchFilter: SearchFilter, showUser?: boolean): Promise<ProposalComment[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/proposal/comment/search';
      if (showUser) {
        url += '?show_user=true';
      }

      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, body,options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public delete(proposalId: string, id: string): Promise<any> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("proposalId is required.");
    }

    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/proposal/' + proposalId + '/comment/' + id;
      let options = this.getDefaultOptions();

      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
