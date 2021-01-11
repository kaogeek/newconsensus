/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { AuthenManager, DebateFacade, RoomFacade } from '../services/services';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilter } from '../models/models';
import { DialogData } from 'src/app/models/models';
import { DialogEditComment } from './shares/dialog/dialog';

const PAGE_NAME: string = 'test';

@Component({
  selector: 'test-component',
  templateUrl: './TestComponent.component.html',
})
export class TestComponent implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private debateFacade: DebateFacade;
  private roomFacade: RoomFacade;
  private authMgr: AuthenManager;
  private dialog: MatDialog;
  public user: any;
  public debate: any;
  public editDebate: any;

  constructor(debateFacade: DebateFacade, authMgr: AuthenManager, roomFacade: RoomFacade, dialog: MatDialog) {
    this.debateFacade = debateFacade;
    this.authMgr = authMgr;
    this.roomFacade = roomFacade;
    this.dialog = dialog;
    this.user = {};
    this.debate = {};
    this.editDebate = {};
  }

  ngOnInit() {
  }

  public onLoginClick(): void {
    this.authMgr.login(this.user.username, this.user.password).then((result: any) => {
      this.user.token = result.token;
    }).catch((error: any) => {
      this.user.token = undefined;
      // console.log(error);
    });
  }

  public onLogoutClick(): void {
    this.authMgr.logout().then(() => {
      this.user.token = undefined;
    }).catch((error: any) => {
      this.user.token = undefined;
      // console.log(error);
    });
  }

  public createDebate(): void {
    this.debateFacade.create(this.debate).then((result: any) => {
      // console.log(result);
    }).catch((error: any) => {
      // console.log(error);
    });
  }

  public findDebate(): void {
    this.debateFacade.find(this.debate.id).then((result: any) => {
      // console.log(result);
    }).catch((error: any) => {
      // console.log(error);
    });
  }

  public _editDebate(): void {
    this.debateFacade.edit(this.editDebate.id, this.editDebate).then((result: any) => {
      // console.log(result);
    }).catch((error: any) => {
      // console.log(error);
    });
  }

  public searchDebate(): void {
    let searchFilter: SearchFilter = new SearchFilter();
    searchFilter.whereConditions = [
      { "content": "test" },
      { "id": "2" }
    ];

    this.debateFacade.search(searchFilter).then((result: any) => {
      // console.log(result);
    }).catch((error: any) => {
      // console.log(error);
    });
  }

  public searchRooms(): void {
    let searchFilter: SearchFilter = new SearchFilter();

    this.roomFacade.search(searchFilter).then((result: any) => {
      // console.log(result);
    }).catch((error: any) => {
      // console.log(error);
    });
  }

  public getCurrentUser(): string {
    if (this.authMgr.getCurrentUser()) {
      return JSON.stringify(this.authMgr.getCurrentUser());
    }

    return 'No User';
  }

  public showEditDialog(): void {
    let dialogData = new DialogData();
    dialogData.text = "test";
    const dialogRef = this.dialog.open(DialogEditComment, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // public searchProposal(): void {
  //   let searchFilter: SearchFilter = new SearchFilter();
  //
  //   this.roomFacade.search(searchFilter).then((result: any)=>{
  //   }).catch((error: any)=>{
  //     console.log(error);
  //   });
  // }

}
