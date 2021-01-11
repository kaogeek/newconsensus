/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'room-button',
  templateUrl: './RoomButton.component.html'
})
export class RoomButton {

  @Input()
  protected text: string = "ข้อความ";
  @Input()
  protected count: string = "0";
  @Input()
  protected color: string = "#ffffff";
  @Input()
  protected bgColor: string = "";
  @Input()
  protected class: string | [string];
  @Input()
  protected crColor: string = "";
  @Input()
  protected link: string = "#"; 

  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public isActive(is: boolean): boolean {
    if (is && this.link.includes("/main/proposal/room/")) {
      return true;
    } else if (is && decodeURI(this.router.url).includes("/main/proposal") && !decodeURI(this.router.url).includes("/main/proposal/room/")) {
      return true;
    }
    return false;
  }

}
