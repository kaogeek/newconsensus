/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';


@Component({
  selector: 'comment-item',
  templateUrl: './CommentItem.component.html'
})
export class CommentItem {

    @Input()
    protected width: string = "100%";
    @Input()
    protected height: string = "130pt";
    @Input()
    protected class: string | [string];
    @Input()
    protected bgColor: string = "#ffffff";
    @Input()
    protected comment: string = "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment";
    @Input()
    protected name: string = "ปิยบุตร แสงกนกกุล";
    @Input()
    protected create: string = "10/12/2019 17:30:30";
    @Input()
    protected likeTotal: number = 80;
    @Input()
    protected dislikeTotal: number = 20;

  constructor() {    

  }
  
}
