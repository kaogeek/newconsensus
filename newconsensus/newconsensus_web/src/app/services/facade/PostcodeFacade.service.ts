/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { AbstractFacade } from "./AbstractFacade";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { Injectable } from '@angular/core';
import { SearchFilter } from "../../models/SearchFilter";
import { Postcode } from '../../models/Postcode';


@Injectable()
export class PostcodeFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public find(id: string): Promise<Postcode> {
    if (id === undefined || id === null || id === '') {
      new Error("id is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/postcode/' + id;

      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public search(searchFilter: SearchFilter): Promise<Postcode[]> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/postcode/search';
      let body: any = {};
      if (searchFilter !== null && searchFilter !== undefined) {
        body = Object.assign(searchFilter)
      }

      this.http.post(url, body).toPromise().then((response: any) => {
        resolve(response.data as Postcode[]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
