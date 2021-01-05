import { Injectable } from '@angular/core';
import { AbstractFacade } from "./AbstractFacade";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { SearchFilter } from '../../../app/models/models';
import { Partner } from 'src/app/models/Partner';

@Injectable()
export class PartnerFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public getPartner(): Promise<Partner> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/partner/search';
      let options = this.getDefaultOptions();
      let searchFilter = new SearchFilter(); 
      let body: any = {};
      body = Object.assign(searchFilter)
      this.http.post(url, body, options).toPromise().then((response: any) => {
        resolve(response.data as Partner);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
