/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'supporter-bar',
  templateUrl: './SupporterBar.component.html'
})
export class SupporterBar implements OnInit {
 
  @Input()
  protected supported: number = 0;
  @Input()
  protected max: number = 500;
  @Input()
  protected color: string = "#ffffff";
  @Input()
  protected class: string | [string];

  constructor() {
  }

  ngOnInit() {

  }

  public getValue(): number {
    return (this.supported / this.max) * 100;
  }
}
