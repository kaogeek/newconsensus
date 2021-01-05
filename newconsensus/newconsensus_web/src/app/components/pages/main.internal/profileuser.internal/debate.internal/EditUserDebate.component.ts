import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogAlert } from '../../../../../components/shares/shares';
import { MESSAGE } from '../../../../../AlertMessage';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CacheConfigInfo } from '../../../../../services/CacheConfigInfo.service';
import { BadWordUtils } from '../../../../../utils/BadWordUtils';


@Component({
  selector: 'newcon-user-debate-edit',
  templateUrl: './EditUserDebate.component.html',
})
export class EditUserDebate implements OnInit {

  private cacheConfigInfo: CacheConfigInfo;

  public cloneData: any;
  public dialog: MatDialog;

  @Input()
  private data: any;
  @Output()
  public clickEditDebate: EventEmitter<any> = new EventEmitter();
  @Output()
  public clickBack: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;

  constructor(dialog: MatDialog,cacheConfigInfo: CacheConfigInfo) {
    this.dialog = dialog;
    this.cacheConfigInfo = cacheConfigInfo;

  }
  ngOnInit(): void {
    this.cloneData = JSON.parse(JSON.stringify(this.data));
  }

  /**
   * isDisabled
   */
  public isDisabledBtn(): boolean {
    if ((this.data.title.trim() == "" || this.data.content.trim() == "") || (this.data.title.trim() === this.cloneData.title.trim() && this.data.content.trim() === this.cloneData.content.trim())) {
      return true;
    }
    return false
  }

  public checkValue() {
    if (this.isDisabledBtn()) {
      return;
    }

    // filter
    this.data.title = BadWordUtils.clean(this.data.title);
    // filter
    this.data.content = BadWordUtils.clean(this.data.content);

    this.clickEditDebate.emit(this.data);
  }
  /**
   * clickCheckBack
   */
  public clickCheckBack() {
    if (this.data.title.trim() !== this.cloneData.title.trim() || this.data.content.trim() !== this.cloneData.content.trim()) {
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
          if(res){
            this.data = JSON.parse(JSON.stringify(this.cloneData));
            this.clickBack.emit();
          }
        });
    } else {
      this.clickBack.emit();
    }
  }

}
