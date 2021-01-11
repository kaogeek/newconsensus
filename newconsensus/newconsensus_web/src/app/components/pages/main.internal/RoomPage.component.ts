/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilter } from '../../../models/models';
import { RoomFacade } from '../../../services/facade/RoomFacade.service';
import { AbstractPage } from '../AbstractPage';
import { AuthenManager } from '../../../services/services';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'room';

@Component({
  selector: 'newcon-room-page',
  templateUrl: './RoomPage.component.html',
})
export class RoomPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private roomFacade: RoomFacade;
  public roomList: any[];

  constructor(authenManager: AuthenManager, router: Router, roomFacade: RoomFacade, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);

    this.roomFacade = roomFacade;
    this.roomList = [];
  }

  public ngOnInit() {
    super.ngOnInit();
    this.reloadAllRoom();
  }

  private reloadAllRoom(): void {
    this.roomList = [];

    let filter = new SearchFilter();
    filter.orderBy = {
      "name": "ASC"
    };
    this.roomFacade.search(filter).then((result: any)=>{
      this.roomList = result;
    }).catch((error: any)=>{
      // console.log('error: '+error);
    });
  }

  public clickIsLogin(): void {
    this.showAlertLoginDialog("/main/proposal/comment/create");
  }

  public isShowRooms(): boolean {
    return this.router.url.includes("/comment") || this.router.url.includes("page");
  }

}
