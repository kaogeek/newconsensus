import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { AbstractFacade } from "./AbstractFacade";
import { Vote } from "../../models/Vote";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class VoteFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public find(id: string , userLike?: string): Promise<Vote> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + id;

      if (userLike) {
        url += '?user_like='+userLike;
      }
      
      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Vote[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as Vote[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public searchHot(roomId?: number, limit?: number): Promise<Vote[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/search/hot';

      if (roomId !== undefined && roomId !== null) {
        url += '?room_id=' + roomId;
      }

      if (limit !== undefined && limit !== null) {
        if (url.indexOf('room_id') >= 0) {
          url += '&limit=' + limit;
        } else {
          url += '?limit=' + limit;
        }
      }

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data as Vote[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public findCommentCountById(id: string): Promise<Vote> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + id + '/count';

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public likeVote(id: string, isLike: string): Promise<Vote> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + id + '/like';

      let body: any = {
        "isLike": isLike 
      };
      let options = this.getDefaultOptions();

      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Vote);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public deleteLike(id: string): Promise<Vote> {
    if (id === undefined || id === null || id === '') {
      new Error("Id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/vote/' + id + '/like';

      this.http.delete(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }


}
