import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { ProposalComment } from "../../models/ProposalComment";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class ProposalCommentFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public delete(proposalId: string, id: any): Promise<ProposalComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    if (proposalId === undefined || proposalId === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + proposalId + '/comment/' + id;
      let options = this.getDefaultOptions();
      this.http.delete(url, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment[]);
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
      let url: string = this.baseURL + '/admin/proposal/' + proposalId + '/comment/' + id;

      let options = this.getDefaultOptions();
      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(proposalId: string, searchFilter: SearchFilter): Promise<ProposalComment[]> {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
      new Error("Proposal Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + proposalId + '/comment/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      let options = this.getDefaultOptions();
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public approve(proposalId: any , id: any): Promise<ProposalComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + proposalId + '/comment/' + id + "/approve";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public unapprove(proposalId: any , id: any): Promise<ProposalComment[]> {
    if (id === undefined || id === null) {
      new Error("Id is required.");
    }
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/admin/proposal/' + proposalId + '/comment/' + id + "/unapprove";
      let options = this.getDefaultOptions();
      this.http.put(url, {}, options).toPromise().then((response: any) => {
        resolve(response.data as ProposalComment[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
