import { Injectable } from '@angular/core';
import { AbstractFacade } from "./AbstractFacade";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { EditProfileUserPages } from 'src/app/models/EditProfileUserPages';

@Injectable()
export class EditProfileUserPageFacade extends AbstractFacade {

  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }

  public getProfile(): Promise<EditProfileUserPages> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/get-profile';
      let options = this.getDefaultOptions() ;
      
      this.http.get(url, options).toPromise().then((response: any) => {
        resolve(response.data as EditProfileUserPages);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
  public editProfile(data: EditProfileUserPages): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/edit-profile';
      let body: any = {};
      if (data !== null && data !== undefined) {
        body = Object.assign(data)
      }
      let options = this.getDefaultOptions();

      this.http.post(url, data, options).toPromise().then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
  public findCountPageUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/pageuser/count';
   
      this.http.get(url).toPromise().then((response: any) => {
        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}