/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';


@Component({
  selector: 'newcon-button-save',
  templateUrl: './NewConButtonSave.component.html'
})
export class NewConButtonSave {

    @Input()
    protected text: string = "ข้อความ";
    @Input()
    protected color: string = "#ffffff";
    @Input()
    protected bgColor: string = "#279d90";
    @Input()
    protected isRadius: boolean = true;
    @Input()
    protected isLoading: boolean = false;
    @Input()
    protected class: string | [string];

  constructor() {    

  }
  
}
