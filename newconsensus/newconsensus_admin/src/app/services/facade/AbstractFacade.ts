import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenManager } from '../AuthenManager.service';

export abstract class AbstractFacade {

  protected baseURL: string;
  protected http: HttpClient;
  protected authMgr: AuthenManager;

  constructor(http: HttpClient, authMgr: AuthenManager, baseURL?: string) {
    this.http = http;
    this.baseURL = baseURL;
    this.authMgr = authMgr;

    if (this.baseURL === undefined || this.baseURL === null) {
      this.baseURL = environment.apiBaseURL;
    }
  }

  public getDefaultOptions(): any {
    let header = this.getDefaultHeader();

    let httpOptions = {
      headers: header
    };

    return httpOptions;
  }

  public getDefaultHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authMgr.getUserToken()
    });

    return headers;
  }

  public getHttp(): HttpClient {
    return this.http;
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public getUserToken(): string {
    return this.authMgr.getUserToken();
  }
}
