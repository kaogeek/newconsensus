import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { AbstractPage } from '../../AbstractPage';
import { AuthenManager, RelateTagFacade } from '../../../../services/services';
import { Debate } from '../../../../models/Debate';
import { DialogAlert } from '../../../shares/dialog/DialogAlert.component';
import { MatDialog } from '@angular/material/dialog';
import { MESSAGE } from '../../../../AlertMessage';
import { Router } from '@angular/router';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BadWordUtils } from '../../../../utils/BadWordUtils';
import { MultipleSelectAutoComp } from 'src/app/components/components';


const PAGE_NAME: string = 'create';

@Component({
  selector: 'newcon-create-debate-page',
  templateUrl: './DebateCreatePage.component.html',
})
export class DebateCreatePage extends AbstractPage implements OnInit {

  private debateFacade: DebateFacade;
  private cacheConfigInfo: CacheConfigInfo;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public title: string;
  public content: string;
  public debates: any[];

  @ViewChild("relateTagAutoComp", { static: false })
  public relateTagAutoComp: MultipleSelectAutoComp;
  public relateTagFacade: RelateTagFacade;
  public debate: Debate;
  public selectedRelateTag: any;

  public Editor = ClassicEditor;

  constructor(authenManager: AuthenManager, relateTagFacade: RelateTagFacade, debateFacade: DebateFacade, dialogs: MatDialog, router: Router, cacheConfigInfo: CacheConfigInfo) {
    super(PAGE_NAME, authenManager, dialogs, router);
    this.debateFacade = debateFacade;
    this.router = router;
    this.cacheConfigInfo = cacheConfigInfo;
    this.relateTagFacade = relateTagFacade;
    this.selectedRelateTag = {};

    if (!this.isLogin()) {
      this.router.navigateByUrl("/main/debate");
    }
  }

  ngOnInit() {
    super.ngOnInit();
    let data = sessionStorage.getItem("debate_create");
    let createData = data ? JSON.parse(data) : {};
    this.debate.title =  createData.title;
    this.debate.content =  createData.content;
    this.selectedRelateTag = createData.selectedRelateTag ? createData.selectedRelateTag : {};
  }

  public createDebate(): void {
    if (!this.isLogin()) {
      return;
    }

    if (this.title === undefined || this.title === null || this.title === '' || this.title.trim().length <= 0) {
      this.dialog.open(DialogAlert, {
        disableClose: true,
        data: {
          text: MESSAGE.TEXT_TITLE,
          bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
          bottomColorText2: "black",
          btDisplay1: "none"
        }
      });
      return;
    }

    if (this.content === undefined || this.content === null || this.content.trim().length <= 0) {
      this.dialog.open(DialogAlert, {
        disableClose: true,
        data: {
          text: MESSAGE.TEXT_CONTENT,
          bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
          bottomColorText2: "black",
          btDisplay1: "none"
        }
      });
      return;
    }

    let debate = new Debate();
    debate.title = this.title.trim();
    debate.content = this.content.trim();

    // filter
    debate.title = BadWordUtils.clean(debate.title);
    // filter
    debate.content = BadWordUtils.clean(debate.content);

    this.debateFacade.create(debate).then((result: any) => {
      this.resetData();

      const confirmEventEmitter = new EventEmitter<any>();
      confirmEventEmitter.subscribe(() => {
        sessionStorage.removeItem("debate_create");
        this.router.navigateByUrl("/main/debate/comment/post/" + result.id + "-" + result.title + "");
        this.title = '';
        this.content = '';
      });

      this.dialog.open(DialogAlert, {
        disableClose: true,
        data: {
          text: MESSAGE.TEXT_SUCCESS,
          bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
          bottomColorText2: "black",
          btDisplay1: "none",
          confirmClickedEvent: confirmEventEmitter,
        }
      });

    }).catch((error: any) => {
      // console.log(error);
      let data = {
        title: this.debate.title,
        content: this.debate.content,
        selectedRelateTag: this.selectedRelateTag,
      };
      sessionStorage.setItem("debate_create", JSON.stringify(data));
      this.dialog.open(DialogAlert, {
        disableClose: true,
        data: {
          text: MESSAGE.TEXT_ERROR,
          bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
          bottomColorText2: "black",
          btDisplay1: "none"
        }
      });
    });
  }

  private resetData(): void {
    this.debate = new Debate();

    this.title = '';
    this.content = '';

    if (this.relateTagAutoComp) {
      this.relateTagAutoComp.clearAutoComp();
    }
    this.selectedRelateTag = {};
  }

  private isEmptyString(value: string): boolean {
    if (value === undefined || value === '') {
      return true;
    }

    const regEx = /([^\s]*)/;
    if (!value.match(regEx)) {
      return true;
    }

    return false;
  }
}
