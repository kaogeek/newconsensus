/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';


@Component({
  selector: 'vote-content-card',
  templateUrl: './VoteContentCard.component.html'
})
export class VoteContentCard {

    @Input()
    protected title: string = "ใส่หัวข้อ";
    @Input()
    protected content: string = "content content content content content content content content content content content content content content content content content";
    @Input()
    protected date: string = "00/00/0000";
    @Input()
    protected textLink: string = "อ่านต่อ...";
    @Input()
    protected imgLink: string = "https://www.khaosod.co.th/wp-content/uploads/2019/05/60338432_2606273349444568_2741691862300491776_o-696x643.jpg";
    @Input()
    protected link: string = "https://www.c-ville.com/wp-content/uploads/2019/09/Cats-660x335.jpg";
    @Input()
    protected width: string = "450pt";
    @Input()
    protected height: string = "200pt";
    @Input()
    protected imgWidth: string = "190pt";
    @Input()
    protected colorTitle: string = "#000";
    @Input()
    protected colorContent: string = "#6c757d";
    @Input()
    protected bgContent: string = "#ffffff";
    @Input()
    protected colorLink: string = "blue";
    @Input()
    protected flex: string = "row";
    @Input()
    protected displayFull: string = "block";
    @Input()
    protected displayHide: string = "none";
    @Input()
    protected class: string | [string];

  constructor() {    

  }
  
}
