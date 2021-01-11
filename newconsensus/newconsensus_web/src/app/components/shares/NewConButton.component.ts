/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';


@Component({
  selector: 'newcon-button',
  templateUrl: './NewConButton.component.html'
})
export class NewConButton {

  @Input()
  protected voteId: any;
  @Input()
  protected text: string = "ข้อความ";
  @Input()
  protected color: string = "#ffffff";
  @Input()
  protected bgColor: string = "#313f40";
  @Input()
  protected link: string;
  @Input()
  protected isRadius: boolean = true;
  @Input()
  protected isDisable: boolean = false;
  @Input()
  protected isNewTab: boolean = false;
  @Input()
  protected class: string | [string];
  @Input()
  protected param: string | [string];

  constructor() {
    if(this.link === undefined || this.link === 'undefined'){
      return;
    }
  } 
}
