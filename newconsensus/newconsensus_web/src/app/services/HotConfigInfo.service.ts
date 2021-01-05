import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ObservableManager } from './ObservableManager.service';
import { Config } from '../models/models';
import { AbstractFacade } from './facade/AbstractFacade';
import { AuthenManager } from './AuthenManager.service';
import { DEBATE_HOT_CONFIG_NAME } from '../Constants';

const TOKEN_KEY: string = 'token';
const TOKEN_MODE_KEY: string = 'mode';

// only page user can login
@Injectable()
export class HotConfigInfo extends AbstractFacade {

  public static readonly TOKEN_KEY: string = TOKEN_KEY;
  public static readonly TOKEN_MODE_KEY: string = TOKEN_MODE_KEY;

  protected baseURL: string;
  protected http: HttpClient;
  protected configMap: any;
  
  protected observManager: ObservableManager;

  constructor(http: HttpClient, authMgr: AuthenManager, observManager: ObservableManager) {
    super(http, authMgr);
    this.http = http;
    this.baseURL = environment.apiBaseURL;
    this.observManager = observManager;
    this.configMap = {};
  }

  public getDebateHotScore(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.configMap[DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR]){
        resolve(this.configMap[DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR]);
        return;
      }

      this.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes: any) => {
        this.configMap[DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR] = hotRes.data;

        resolve(hotRes);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public getHotIndicator(configName: string): Promise<Config> {
    if (configName === null || configName === undefined) {
      new Error("configName is required.");
    }

    return new Promise((resolve, reject) => {
      if(this.configMap[configName]){
        resolve(this.configMap[configName]);
        return;
      }

      let url: string = this.baseURL + '/config/' + configName;

      this.http.get(url).toPromise().then((response: any) => {
        if(response.data){
          this.configMap[configName] = response.data;
        }

        resolve(response.data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  public reloadData(): Promise<any> {
    // reset hot core
    this.getDebateHotScore = undefined;
    
    return this.getDebateHotScore();
  }

  // return current login user admin status
  public isAdminUser(): boolean {
    return false;
  }
}
