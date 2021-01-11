/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';


@Component({
  selector: 'content-card',
  templateUrl: './ContentCard.component.html'
})
export class ContentCard {

    @Input()
    protected title: string = "ใส่หัวข้อ";
    @Input()
    protected content: string = "content content content content content content content content content content content content content content content content content";
    @Input()
    protected textLink: string = "อ่านต่อ...";
    @Input()
    protected create: string = "10/12/2019 17:30:30";
    @Input()
    protected images: string = "https://mpics.mgronline.com/pics/Images/561000012721901.JPEG";
    @Input()
    protected link: string = "https://www.c-ville.com/wp-content/uploads/2019/09/Cats-660x335.jpg";
    @Input()
    protected width: string = "450pt";
    @Input()
    protected height: string = "200pt";
    @Input()
    protected colorTitle: string = "#000";
    @Input()
    protected colorContent: string = "#6c757d";
    @Input()
    protected bgContent: string = "#ffffff";
    @Input()
    protected colorLink: string = "blue";
    @Input()
    protected isImageHeader: boolean = false;
    @Input()
    protected class: string | [string];
    @Input()
    protected function: string | [string];
    @Input()
    protected isAll: boolean = false;
    @Input()
    protected isAllpost: boolean = false;
    @Input()
    protected isArticle: boolean = false;
    @Input()
    protected isContent: boolean = false;

  constructor() {    

  }
  public setParamAllpost() {
    sessionStorage.setItem('param', '1');
  }

  public setParamArticle() {
    sessionStorage.setItem('param', '2');
  }

  public setParamContent() {
    sessionStorage.setItem('param', '3');
  }
  
}
