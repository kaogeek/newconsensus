import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AbstractPage } from '../../AbstractPage';
import { MESSAGE } from '../../../../AlertMessage';
import { AutoComp } from '../../../shares/AutoComp.component';
import { MultipleSelectAutoComp } from '../../../shares/MultipleSelectAutoComp.component';
import { ProposalFacade } from '../../../../services/facade/ProposalFacade.service';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { RoomFacade } from '../../../../services/facade/RoomFacade.service';
import { RelateTagFacade } from '../../../../services/facade/RelateTagFacade.service';
import { Proposal } from '../../../../models/Proposal';
import { AuthenManager } from '../../../../services/AuthenManager.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BadWordUtils } from '../../../../utils/BadWordUtils';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { PROPOSAL_CONFIG_NAME } from '../../../../Constants';

const PAGE_NAME: string = 'create';

@Component({
  selector: 'newcon-proposal-create-page',
  templateUrl: './ProposalCreatePage.component.html',
})
export class ProposalCreatePage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private proposalFacade: ProposalFacade;
  @ViewChild("roomAutoComp", { static: false })
  public roomAutoComp: AutoComp;
  @ViewChild("deabateAutoComp", { static: false })
  public debateAutoComp: AutoComp;
  @ViewChild("relateTagAutoComp", { static: false })
  public relateTagAutoComp: MultipleSelectAutoComp;
  public roomFacade: RoomFacade;
  public relateTagFacade: RelateTagFacade;
  public debateFacade: DebateFacade;
  public proposal: Proposal;
  public cacheConfigInfo: CacheConfigInfo;
  public roomWhereConditions: string[];
  public debateWhereConditions: string[];
  public selectedRoom: any;
  public selectedRelateTag: any;
  public selectedDebate: any;
  private activatedRoute: ActivatedRoute;

  public Editor = ClassicEditor;

  constructor(authenManager: AuthenManager, router: Router, proposalFacade: ProposalFacade,
    roomFacade: RoomFacade, debateFacade: DebateFacade, relateTagFacade: RelateTagFacade, cacheConfigInfo: CacheConfigInfo, dialog: MatDialog,
    activatedRoute: ActivatedRoute) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.proposalFacade = proposalFacade;
    this.roomFacade = roomFacade;
    this.relateTagFacade = relateTagFacade;
    this.debateFacade = debateFacade;
    this.cacheConfigInfo = cacheConfigInfo;
    this.proposal = new Proposal();
    this.roomWhereConditions = ["name"];
    this.selectedRoom = {};
    this.selectedRelateTag = {};
    this.debateWhereConditions = ["title"];
    this.selectedDebate = {};
    if (!this.isLogin()) {
      this.router.navigateByUrl("/main/proposal");
    }
  }

  public ngOnInit() {
    this.setScrollTop();
    let data = sessionStorage.getItem("proposal_create");
    let createData = data ? JSON.parse(data) : {};
    this.proposal.title = createData.title;
    this.proposal.videoUrl = createData.videoUrl;
    this.proposal.imageUrl = createData.imageUrl;
    this.proposal.content = createData.content;
    this.selectedRelateTag = createData.selectedRelateTag ? createData.selectedRelateTag : {};
    this.selectedRoom = createData.selectedRoom ? createData.selectedRoom : {};
  }

  private setScrollTop(): void {
    var scrolltotop = document.getElementById("menubottom");
    scrolltotop.scrollTop = 450;
  }

  private resetData(): void {
    this.proposal = new Proposal();

    if (this.roomAutoComp) {
      this.roomAutoComp.clearAutoComp();
    }
    this.selectedRoom = {};

    if (this.debateAutoComp) {
      this.debateAutoComp.clearAutoComp();
    }
    this.selectedDebate = {};

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

  public onSubmitBtnClick(): void {
    if (this.proposal.title !== undefined) {
      this.proposal.title = this.proposal.title.trim();
    }

    if (this.proposal.content !== undefined) {
      this.proposal.content = this.proposal.content.trim();
    }

    if (this.proposal.imageUrl !== undefined) {
      this.proposal.imageUrl = this.proposal.imageUrl.trim();
      var str = this.proposal.imageUrl;
      var n = str.includes("http://");
      var m = str.includes("https://");

      if (n != true && m != true) {
        this.showAlertDialog('กรุณาใส่ลิงค์รูปภาพใหม่');
        return;
      }
    }

    if (this.isEmptyString(this.proposal.title)) {
      this.showAlertDialog(MESSAGE.TEXT_TITLE);
      return;
    }

    if (this.isEmptyString(this.proposal.content)) {
      this.showAlertDialog(MESSAGE.TEXT_CONTENT);
      return;
    }

    // filter
    this.proposal.title = BadWordUtils.clean(this.proposal.title);
    // filter
    this.proposal.content = BadWordUtils.clean(this.proposal.content);

    this.proposal.roomId = this.selectedRoom.id;
    // this.proposal.relateTagId = this.selectedRelateTag.id;

    if (this.proposal.roomId === undefined || this.proposal.roomId === null || isNaN(this.proposal.roomId)) {
      this.showAlertDialog('กรุณาเลือกห้องของกระทู้');
      return;
    }

    if (this.selectedDebate !== undefined && this.selectedDebate.id !== undefined) {
      this.proposal.debateTag = '["' + this.selectedDebate.id + '"]';
    }

    this.proposal.reqSupporter = 500;
    try {
      this.proposal.roomId = parseInt(this.proposal.roomId as any);
    } catch (error) {
      this.proposal.roomId = undefined;
    }

    if (this.proposal.roomId === undefined || isNaN(this.proposal.roomId)) {
      this.showAlertDialog("กรุณากรอกรหัสห้องของกระทู้");
      return;
    }

    this.proposalFacade.create(this.proposal).then((result: any) => {
      this.resetData();

      return this.cacheConfigInfo.getConfig(PROPOSAL_CONFIG_NAME.APPROVE_AUTO);
    }).then((result: any) => {
      if (result.value !== undefined) {
        if (result.value !== undefined && (result.value.toLowerCase() !== 'true')) {
          this.showAlertDialog("ระบบได้รับข้อมูลแล้ว กระทู้ของท่านจะแสดงหลังจากผู้ดูแลระบบอนุมัติ");
          sessionStorage.removeItem("proposal_create");
          this.router.navigateByUrl('/main/proposal');
        }
      }
    }).catch((error: any) => {
      let data = {
        title: this.proposal.title,
        videoUrl: this.proposal.videoUrl,
        imageUrl: this.proposal.imageUrl,
        content: this.proposal.content,
        selectedRelateTag: this.selectedRelateTag,
        selectedRoom: this.selectedRoom
      };
      sessionStorage.setItem("proposal_create", JSON.stringify(data));
      this.showDialogError(error.error.name, this.router.url);
    });
  }
}
