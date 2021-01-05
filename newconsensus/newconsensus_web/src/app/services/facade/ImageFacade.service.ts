import { AbstractFacade } from "./AbstractFacade";
import { HttpClient } from '@angular/common/http';
import { AuthenManager } from '../AuthenManager.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageFacade extends AbstractFacade {
  constructor(http: HttpClient, authMgr: AuthenManager) {
    super(http, authMgr);
  }
  public avatarProfile(name: string, path: string, width?: number, height?: number): Promise<any> {
    if (name === undefined || name === null || name === '') {
      new Error("name is required.");
    }

    if (path === undefined || path === null || path === '') {
      new Error("path is required.");
    }

    return new Promise((resolve, reject) => {
      let url: string = this.baseURL + '/media/image-resize';
      url += '?name=' + name + '&path=' + path;

      if (width !== undefined && width !== null) {
        url += '&width=' + width;
      }

      if (height !== undefined && height !== null) {
        url += '&height=' + height;
      }

      this.http.get(url, { responseType: 'blob' }).toPromise().then((response: any) => {

        resolve(response);
      }).catch((error: any) => {
        // console.log(error)
        reject(error);
      });
    });
  }
}
