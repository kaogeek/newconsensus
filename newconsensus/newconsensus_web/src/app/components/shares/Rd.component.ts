import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { AbstractPage } from '../pages/AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { AuthenManager, PageUserInfo } from '../../services/services'; 
import { Router } from '@angular/router';
const PAGE_NAME: string = 'Rd';


@Component({
  selector: 'Rd',
  templateUrl: './Rd.component.html'
})
export class Rd extends AbstractPage implements OnInit {
 
  public static readonly PAGE_NAME: string = PAGE_NAME;
  
  constructor(authenManager: AuthenManager,router: Router, dialog: MatDialog, pageUserInfo: PageUserInfo) {
    super(PAGE_NAME, authenManager, dialog, router);
  }

  public redirect() {
    this.router.navigate(['main']);
  }

  ngOnInit(): void {
    super.ngOnInit(); 
    this.redirect();
  }

}
