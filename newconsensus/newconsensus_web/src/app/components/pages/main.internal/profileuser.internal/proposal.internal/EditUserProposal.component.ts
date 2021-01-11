/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { AuthenManager } from '../../../../../services/AuthenManager.service';
import { AbstractPage } from '../../../AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlert } from '../../../../../components/shares/shares';
import { MESSAGE } from '../../../../../AlertMessage';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RoomFacade } from '../../../../../services/facade/RoomFacade.service';
import { DebateFacade } from '../../../../../services/facade/DebateFacade.service';
import { Router } from '@angular/router';
import { BadWordUtils } from '../../../../../utils/BadWordUtils';

const PAGE_NAME: string = 'pageuser-proposal-edit';

@Component({
  selector: 'newcon-user-proposal-edit',
  templateUrl: './EditUserProposal.component.html',
})
export class EditUserProposal extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;
 
  private selectedRoom: any;
  private selectedDebate: any;
  private cloneData: any;
  private cloneSelectedRoom: any;
  private cloneSelectedDebate: any;

  @Input()
  private data: any;
  @Output()
  public clickEditProposal: EventEmitter<any> = new EventEmitter();
  @Output()
  public closeEditProposal: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  public roomFacade: RoomFacade;
  public debateFacade: DebateFacade;
  public roomWhereConditions: string[];
  public debateWhereConditions: string[];


  constructor(authenManager: AuthenManager, router: Router, dialog: MatDialog, roomFacade: RoomFacade, debateFacade: DebateFacade) {
    super(PAGE_NAME, authenManager, dialog, router);
 
    this.selectedRoom = {}; 
    this.selectedDebate = {};
    this.roomFacade = roomFacade;
    this.debateFacade = debateFacade;
    this.roomWhereConditions = ["name"];
    this.debateWhereConditions = ["title"];
  }

  public ngOnInit(): void {
    super.ngOnInit();
    if (this.data !== undefined) {
      this.selectedRoom.id = this.data.roomId;

      if (this.data.debates !== undefined && Array.isArray(this.data.debates) && this.data.debates.length > 0) {
        this.selectedDebate.id = this.data.debates[0].id;
        this.selectedDebate.title = this.data.debates[0].title;
      }

      this.cloneData = JSON.parse(JSON.stringify(this.data));
      this.cloneSelectedRoom = JSON.parse(JSON.stringify(this.selectedRoom));
      this.cloneSelectedDebate = JSON.parse(JSON.stringify(this.selectedDebate));
    }
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

  public onEditBtnClicked(): void {

    if (this.isDisabledBtn()) {
      return;
    }

    if (this.data.title !== undefined) {
      this.data.title = this.data.title.trim();
    }

    if (this.data.content !== undefined) {
      this.data.content = this.data.content.trim();
    }

    if (this.isEmptyString(this.data.title)) {
      this.showAlertDialog(MESSAGE.TEXT_TITLE);
      return;
    }

    if (this.isEmptyString(this.data.content)) {
      this.showAlertDialog(MESSAGE.TEXT_CONTENT);
      return;
    }

    // filter
    this.data.title = BadWordUtils.clean(this.data.title);
    // filter
    this.data.content = BadWordUtils.clean(this.data.content);

    this.data.roomId = this.selectedRoom.id;

    if (this.data.roomId === undefined || this.data.roomId === null || isNaN(this.data.roomId)) {
      this.showAlertDialog('กรุณาเลือกห้องของกระทู้');
      return;
    }

    try {
      this.data.roomId = parseInt(this.data.roomId as any);
    } catch (error) {
      this.data.roomId = undefined;
    }

    if (this.data.roomId === undefined || isNaN(this.data.roomId)) {
      this.showAlertDialog("กรุณาเลือกห้องของกระทู้");
      return;
    }

    if (this.selectedDebate !== undefined && this.selectedDebate.id !== undefined) {
      this.data.debateTag = '["' + this.selectedDebate.id + '"]';
    } else {
      this.data.debateTag = '[]';
    }

    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.clickEditProposal.emit(this.data);
    });

    this.showConfirmDialog('ยืนยันการแก้ไขข้อมูล', undefined, undefined, confirmEventEmitter);
  }

  public isDisabledBtn(): boolean {
    if ((this.data.title.trim() == "" || this.data.content.trim() == "")) {
      return true;
    }

    if (this.data.title.trim() !== this.cloneData.title.trim()) {
      return false;
    }

    if (this.data.content.trim() !== this.cloneData.content.trim()) {
      return false;
    }

    // isDirty
    let dataImageUrl = this.data.imageUrl;
    if (dataImageUrl === null || dataImageUrl === '') {
      dataImageUrl = undefined;
    }
    let cloneImageUrl = this.cloneData.imageUrl;
    if (cloneImageUrl === null || cloneImageUrl === '') {
      cloneImageUrl = undefined;
    }
    if (((dataImageUrl === null || dataImageUrl === undefined) && (cloneImageUrl !== null && cloneImageUrl !== undefined))) {
      return false;
    } else if (((dataImageUrl !== null && dataImageUrl !== undefined && dataImageUrl !== '') && (cloneImageUrl === null || cloneImageUrl === undefined || cloneImageUrl === ''))) {
      return false;
    } if ((dataImageUrl ? dataImageUrl.trim() : dataImageUrl) !== (cloneImageUrl ? cloneImageUrl.trim() : cloneImageUrl)) {
      return false;
    }

    // isDirty
    let dataVideoUrl = this.data.videoUrl;
    if (dataVideoUrl === null || dataVideoUrl === '') {
      dataVideoUrl = undefined;
    }
    let cloneVideoUrl = this.cloneData.videoUrl;
    if (cloneVideoUrl === null || cloneVideoUrl === '') {
      cloneVideoUrl = undefined;
    }

    if (((dataVideoUrl === null || dataVideoUrl === undefined) && (dataVideoUrl !== null && dataVideoUrl !== undefined))) {
      return false;
    } else if (((dataVideoUrl !== null && dataVideoUrl !== undefined && dataVideoUrl !== '') && (dataVideoUrl === null || dataVideoUrl === undefined || dataVideoUrl === ''))) {
      return false;
    } else if ((dataVideoUrl ? dataVideoUrl.trim() : dataVideoUrl) !== (cloneVideoUrl ? cloneVideoUrl.trim() : cloneVideoUrl)) {
      return false;
    }

    if(this.cloneSelectedRoom.id !== this.selectedRoom.id){
      return false;
    }

    if(this.cloneSelectedDebate.id !== this.selectedDebate.id){
      return false;
    }

    return true;
  }

  public onBackBtnClicked() {
    if (!this.isDisabledBtn()) {
      let dialog = this.dialog.open(DialogAlert, {
        disableClose: true,
        data: {
          text: "คุณต้องการย้อนกลับไปหน้าเดิมหรือไม่",
          bottomText1: MESSAGE.TEXT_BUTTON_CANCEL,
          bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
          bottomColorText2: "black"
        }
      });
      dialog.afterClosed().subscribe((res) => {
        if (res) {
          this.data = JSON.parse(JSON.stringify(this.cloneData));
          this.closeEditProposal.emit(this.data);
        }
      });
    } else {
      this.closeEditProposal.emit(this.data);
    }
  }

}
