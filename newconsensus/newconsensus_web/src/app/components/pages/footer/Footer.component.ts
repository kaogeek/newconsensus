import { Component, OnInit } from '@angular/core';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { PAGE_INSTAGRAM_URL, PAGE_TWITTER_URL, PAGE_LINE_URL, PAGE_FACEBOOK_URL } from '../../../Constants';

@Component({
  selector: 'newcon-footer',
  templateUrl: './Footer.component.html',

})
export class Footer {

  public isProfile: boolean = false;
  public isLogout: boolean = false;
  public instagramurl: string;
  public twitterurl: string;
  public lineurl: string;
  public facebookurl: string;

  public isShowInstagramurl: boolean;
  public isShowTwitterurl: boolean;
  public isShowLineurl: boolean;
  public isShowFacebookurl: boolean;
  public isShowFollow: boolean;

  private cacheConfigInfo: CacheConfigInfo;

  constructor(cacheConfigInfo: CacheConfigInfo) {
    this.cacheConfigInfo = cacheConfigInfo;
    this.isShowInstagramurl = false;
    this.isShowFollow = true;


    this.cacheConfigInfo.getConfig(PAGE_INSTAGRAM_URL).then((config: any) => {
      if (config.value !== undefined) {
        this.instagramurl = (config.value.toLowerCase());
        let instagramurl = this.instagramurl;
        if (instagramurl !== null && instagramurl !== '' && instagramurl !== undefined) {
          this.isShowInstagramurl = true;
        }
      }
    }).catch((error: any) => { console.log(error) });
    this.cacheConfigInfo.getConfig(PAGE_TWITTER_URL).then((config: any) => {
      if (config.value !== undefined) {
        this.twitterurl = (config.value.toLowerCase());
        let twitterurl = this.twitterurl;
        if (twitterurl !== null && twitterurl !== '' && twitterurl !== undefined) {
          this.isShowTwitterurl = true;
        }
      }
    }).catch((error: any) => { console.log(error) });
    this.cacheConfigInfo.getConfig(PAGE_LINE_URL).then((config: any) => {
      if (config.value !== undefined) {
        this.lineurl = (config.value.toLowerCase());
        let lineurl = this.lineurl;
        if (lineurl !== null && lineurl !== '' && lineurl !== undefined) {
          this.isShowLineurl = true;
        }
      }
    }).catch((error: any) => { console.log(error) });
    this.cacheConfigInfo.getConfig(PAGE_FACEBOOK_URL).then((config: any) => {
      if (config.value !== undefined) {
        this.facebookurl = (config.value.toLowerCase());
        let facebookurl = this.facebookurl;
        if (facebookurl !== null && facebookurl !== '' && facebookurl !== undefined) {
          this.isShowFacebookurl = true;
        }
      }
    }).catch((error: any) => { console.log(error) });

  }

}