import { Component, Input, OnInit } from '@angular/core';
import { PageUserInfo } from '../../services/services';


@Component({
  selector: 'topic-profile',
  templateUrl: './TopicProfile.component.html'
})
export class TopicProfile implements OnInit{ 
  @Input()
  protected width: string = "100%";
  @Input()
  protected height: string = "80pt";
  @Input()
  protected link: string = "https://www.c-ville.com/wp-content/uploads/2019/09/Cats-660x335.jpg";
  @Input()
  protected param: string | [string];
  @Input()
  protected class: string | [string];
  @Input()
  protected bgColor: string = "#ffffff";
  @Input()
  protected topic: string = "ลุงตู่อยากให้รถถังบินได้ !!";
  @Input()
  protected id: number;
  @Input()
  protected hot: boolean;
  @Input()
  protected name: string = "ปิยบุตร แสงกนกกุล";
  @Input()
  protected countComment: number = 55;
  @Input()
  protected create: string = "10/12/2019 17:30:30";
  @Input()
  protected pageUser: any; 
 
  private pageUserInfo: PageUserInfo;  
  private baseUrl: string = "";
  private koopId: string = "";
  private splitText: any = "";
  private baseId: string = "";

  constructor(pageUserInfo: PageUserInfo) {
    this.pageUserInfo = pageUserInfo; 
  }

  ngOnInit(): void {
    this.pageUserInfo.addPageUser(this.pageUser); 
  }

  public isHot(): boolean {
    return this.hot;
  } 

  public getAt(roomid : string): string {
    this.baseUrl = (window.location).href;
    this.koopId = this.baseUrl.substring(this.baseUrl.lastIndexOf('post') + 5);
    this.splitText = this.koopId.split('-')
    this.baseId = this.splitText[0]
    if (roomid == this.baseId) {
      return 'solid 4.5pt #279d90';
    } else{
      return '0.1px solid #f1f1f1';
    }
  }

}
