import { Component, OnInit, EventEmitter } from '@angular/core';
import { SearchFilter } from '../../../../models/models';
import { AuthenManager, DebateFacade, ObservableManager, DebateCommentFacade } from '../../../../services/services';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditComment, DialogAlert } from '../../../../components/shares/dialog/dialog';
import { AbstractPage } from '../../AbstractPage';
import { MESSAGE } from '../../../../AlertMessage';
import { Router } from '@angular/router';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { DEBATE_MENU_ENABLE } from '../../../../Constants';

const PAGE_NAME: string = 'debateuser';
const SEARCH_LIMIT: number = 50;
const PAGE_SIZE: number = 5;
const PAGESIZE_OPTIONS: number[] = [5];

@Component({
  selector: 'newcon-debate-user-page',
  templateUrl: './DebateUserPage.component.html',
})
export class DebateUserPage extends AbstractPage implements OnInit {

  private observManager: ObservableManager;
  private debateFacade: DebateFacade;
  private debateCommentFacade: DebateCommentFacade;
  private cacheConfigInfo: CacheConfigInfo;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public authenManager: AuthenManager;
  public dialog: MatDialog;
  public isLoadingDebate: boolean;
  public resDebate: any;
  public resDebateComment: any;
  public pageSizeOptions: number[] = PAGESIZE_OPTIONS;
  public pageSize: number = PAGE_SIZE;
  public debateComments: any[];
  public dataEditDebate: any;
  public title: string;
  public content: string;
  public isShowDebate: boolean;

  constructor(authenManager: AuthenManager, router: Router, debateFacade: DebateFacade, observManager: ObservableManager, debateCommentFacade: DebateCommentFacade,cacheConfigInfo: CacheConfigInfo, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.authenManager = authenManager;
    this.debateFacade = debateFacade;
    this.observManager = observManager;
    this.debateCommentFacade = debateCommentFacade;
    this.resDebate = [];
    this.resDebateComment = [];
    this.debateComments = [];
    this.isShowDebate = false;
    this.cacheConfigInfo = cacheConfigInfo;
    
    this.cacheConfigInfo.getConfig(DEBATE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowDebate = (config.value.toLowerCase() === 'true');
        if (!this.isShowDebate) {
          this.router.navigateByUrl("/main");
        }
      }
    }).catch((error: any) => { 
      // console.log(error) 
    });

    this.observManager.subscribe('authen.check', (data: any) => {
      // this.searchDebate();
      // this.searchCommentDebate();
    });
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.searchDebate();
    this.searchCommentDebate();
    this.checkAccountStatus().then((res) => {
      if (!res) {
        this.observManager.publish("authen.logout", true);
      }
    });
  }
  private stopLoading(): void {
    setTimeout(() => {
      this.isLoadingDebate = false;
    }, 500);
  }

  public searchDebate(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.resDebate.length;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.orderBy = {
        'createdDate': 'DESC'
      };
      filter.count = false;
      this.isLoadingDebate = true;
      this.debateFacade.search(filter, false, true).then((res: any) => {
        for (let dabate of res) {
          this.resDebate.push(dabate);
        }
        this.stopLoading();
      }).catch((err: any) => {
        this.stopLoading();
        // console.log(err);
      })
    }
  }

  public searchCommentDebate(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.resDebateComment.length;
      filter.whereConditions = [{
        'createdBy': userId,
      }];
      filter.orderBy = {
        'createdDate': 'DESC'
      };
      filter.count = false;
      this.isLoadingDebate = true;
      this.debateCommentFacade.searchUserDebateComment(filter, true).then((res: any) => {
        for (let comment of res) {
          this.resDebateComment.push(comment);
        }
        this.stopLoading();
      }).catch((err: any) => {
        this.stopLoading();
        // console.log(err);
      });
    }
  }

  public editCardDebate(data: any): void {
    this.dataEditDebate = JSON.parse(JSON.stringify(data));
  }

  public saveEditDebate(resultData: any) {
    this.showAlertDialog("คุณต้องการบันทึกข้อมูลนี้หรือไม่").then((res) => {
      if (res) {
        this.debateFacade.edit(resultData.id, resultData).then((res: any) => {
          let index = 0;
          for (let debate of this.resDebate) {
              if (debate.id === resultData.id) {
                this.resDebate[index] = resultData;
                break;
              }
              index++;
          }
          this.dataEditDebate = undefined;
        }).catch((error: any) => {
          // console.log(error);
        });
      }
    });
  }

  public showAlertDialog(text: any, cancelText?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let dialog = this.dialog.open(DialogAlert, {
        disableClose: true,
        data: {
          text: text,
          bottomText1: (cancelText) ? cancelText : MESSAGE.TEXT_BUTTON_CANCEL,
          bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
          bottomColorText2: "black"
        }
      });
      dialog.afterClosed().subscribe((res) => {
        return resolve(res);
      });
    });
  }

  private updateComment(data: any) {
    if (data === undefined) {
      return;
    }

    if (this.resDebateComment && this.resDebateComment.length > 0) {
      let index = this.resDebateComment.map((item: any) => {
        return item.debateId + ':' + item.id;
      }).indexOf(data.debateId + ':' + data.id);

      if (index < this.resDebateComment.length) {
        this.resDebateComment[index].comment = data.comment;
      }
    }
  }

  public editCardDebateComment(data: any): void {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe((result: any) => {
      const cloneData = JSON.parse(JSON.stringify(data));
      cloneData.comment = result.text;
      this.debateCommentFacade.edit(data.debateId, data.id, cloneData).then((result: any) => {
        // update comments
        this.updateComment(result);
      })
    });
    this.dialog.open(DialogEditComment, {
      disableClose: true,
      data: {
        text: (data.comment) ? data.comment : '',
        confirmClickedEvent: confirmEventEmitter
      }
    });
  }
  public clearCardProposal(): void {
    this.dataEditDebate = undefined;
  }

  public deleteCardDebateComment(data: any) {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.debateCommentFacade.delete(data.debateId, data.id).then((result: any) => {
        this.removeComment(data);
      }).catch((error: any) => {
        this.stopLoading();
      });
    });
    this.showDialogWithOptions({
      text: MESSAGE.TEXT_DELETE_CONTENT,
      bottomText1: MESSAGE.TEXT_BUTTON_CANCEL,
      bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
      bottomColorText2: "black",
      confirmClickedEvent: confirmEventEmitter,
    }
    );
  }

  private removeComment(data: any) {
    if (data === undefined) {
      return;
    }

    if (this.resDebateComment && this.resDebateComment.length > 0) {
      let index = this.resDebateComment.map((item: any) => {
        return item.debateId + ':' + item.id;
      }).indexOf(data.debateId + ':' + data.id);

      if (index < this.resDebateComment.length) {
        this.resDebateComment.splice(index, 1);
      }
    }
  }
}
