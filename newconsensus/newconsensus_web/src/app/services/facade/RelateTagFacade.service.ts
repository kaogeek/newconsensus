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
import { Room } from "../../models/Room";
import { SearchFilter } from "../../models/SearchFilter";

@Injectable()
export class RelateTagFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public getTopScore(searchFilter: SearchFilter): Promise<Room[]> {
    return new Promise((resolve, reject) => {
      let limit: any;
      if (searchFilter !== null && searchFilter !== undefined) {
        limit = '?limit=' + searchFilter.limit;
      }

      let url: string = this.baseURL + '/admin/relatetag/topscore' + limit;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data as Room[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
