import { OnInit, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PageContentFacade } from '../../../../services/services';
import { VideoForm } from '../../../shares/VideoView.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActionLogFacade } from '../../../../services/facade/ActionLogFacade.service';

const PAGE_NAME: string = 'postpage';
const URL_PATH: string = '/main/content/postpage/';

@Component({
  selector: 'newcon-content-post-page',
  templateUrl: './ContentPostPage.component.html',
})

export class ContentPostPage implements OnInit {

  private router: Router;
  private pageContentFacade: PageContentFacade;
  private actionLogFacade: ActionLogFacade;
  private pageContentId: string;
  private titleService: Title;
  private metaService: Meta;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public contentPost: any;
  public content: any = [];
  public videoForm: VideoForm;
  public linkUrl: string;
  public linkUrlParam: string;
  public isAllpost: boolean;
  public isArticle: boolean;
  public isContent: boolean;

  constructor(router: Router, pageContentFacade: PageContentFacade, titleService: Title, metaService: Meta, actionLogFacade: ActionLogFacade) {
    this.router = router;
    this.pageContentFacade = pageContentFacade;
    this.contentPost = {};
    this.titleService = titleService;
    this.metaService = metaService;
    this.actionLogFacade = actionLogFacade;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = this.router.url;
        if (url.indexOf(URL_PATH) >= 0) {
          const substringPath: string = url.substring(url.indexOf(URL_PATH), url.length);
          const replaceURL: string = substringPath.replace(URL_PATH, '');
          const splitText = replaceURL.split('-');

          let topicId: string = '';
          if (splitText.length > 0) { 
            topicId = splitText[0];
          } else {
            topicId = replaceURL;
          }

          let regEx = /^\d+$/;
          if (!topicId.match(regEx)) {
            topicId = undefined;
          }

          if (topicId) {
            this.initPage(topicId);
          }
        }
      }
    });
    this.videoForm = {
      width: "",
      height: "",
      class: "newcon-content-post-page-layout-video",
    }
  }
  ngOnInit(): void {
    this.shareLinkToFacebook();
    this.getParam();
  }
  public initPage(topicId: string): void {
    this.contentPost = {};
    this.pageContentId = topicId
    this.pageContentFacade.pageContentDetails(this.pageContentId).then((res: any) => {
      if (res != null) {
        this.contentPost = res;
        this.setMateService();

        this.actionLogFacade.createActionLog(this.pageContentId, 'content'); // add log
      } else {
        this.router.navigateByUrl("/main/content");
      }
    }).catch((error: any) => {
      this.router.navigateByUrl("/main/content");
      // console.log(error);
    });
  }

  public getParam(): any {
    let data  = sessionStorage.getItem('param');
    if(data === '1'){
      this.isAllpost = true;
    }if(data === '2'){
    this.isArticle = true;
    }if(data === '3'){
      this.isContent = true;
      }
  }

  public shareLinkToFacebook(): any {
    this.linkUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
  }

  public setMateService() {
    this.titleService.setTitle(this.contentPost.metaTagTitle);
    this.metaService.addTags([
      { name: 'keywords', content: this.contentPost.metaTagKeyword },
      { name: 'description', content: this.contentPost.metaTagContent },
    ]);
  }

}
