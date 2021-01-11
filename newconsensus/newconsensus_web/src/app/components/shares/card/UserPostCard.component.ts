/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'user-post-card',
  templateUrl: './UserPostCard.component.html'
})
export class UserPostCard {

  @Input()
  protected width: string = "100%";
  @Input()
  protected height: string = "80pt";
  @Input()
  protected data: any; 
  @Input()
  protected link: string;
  @Input()
  protected isEdit: boolean;
  @Input()
  protected bgContent: string = "#ffffff";
  @Input()
  protected class: string | [string];
  @Output()
  protected clickEditCard: EventEmitter<any> = new EventEmitter();
  @Output()
  protected clickDeleteCard: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

}
