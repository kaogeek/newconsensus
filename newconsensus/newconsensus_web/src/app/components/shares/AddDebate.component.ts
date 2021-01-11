/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';


@Component({
  selector: 'add-debate',
  templateUrl: './AddDebate.component.html'
})
export class AddDebate {

    @Input()
    protected width: string = "100%";
    @Input()
    protected height: string = "80pt";
    @Input()
    protected class: string | [string];
    @Input()
    protected bgColor: string = "#ffffff";
    @Input()
    protected link: string = "https://www.c-ville.com/wp-content/uploads/2019/09/Cats-660x335.jpg";
    @Input()
    protected name: string = "+ สร้างกระทู้";
    @Input()
    protected commentCount: number = 55;
  constructor() {   
    

  }  
  
}
