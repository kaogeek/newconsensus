import { Component, OnInit } from '@angular/core'; 
import { ObservableManager } from '../../services/services';

const PAGE_NAME: string = 'main';


@Component({
  selector: 'newcon-main-page',
  templateUrl: './MainPage.component.html',
})
export class MainPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  public hide = true;
  public email: string = '';
  public password: string = '';
  public isclickmenu: boolean;
  public isdivtop: boolean = false;
  public isprofile: boolean = false;
 
  private observManager: ObservableManager;
  loadLogin: boolean = false;


  constructor(observManager: ObservableManager) {
    this.observManager = observManager;
    this.observManager.subscribe('menu.click', (clickmenu) => {
      this.isclickmenu = clickmenu.click;

      if (window.innerWidth >= 1074) {

      } else {
        if (clickmenu.click === true) {
          var element = document.getElementById("menubottom");
          element.classList.add("scroll-mainpage");

        } else {
          var element = document.getElementById("menubottom");
          element.classList.remove("scroll-mainpage");
        }
      }
    });
  }

  public scrollTop() {
    var scrolltotop = document.getElementById("menubottom");

    if (scrolltotop.scrollTop > 50) {
      this.isdivtop = true;
    } else {
      this.isdivtop = false;
    }

    // profile---------------------------------------------
    if (window.innerWidth > 1440) {

      if (scrolltotop.scrollTop > 86.32957) {
        this.isprofile = true;
      } else {
        this.isprofile = false;
      }

    } else if (window.innerWidth <= 1440) {

      if (scrolltotop.scrollTop > 79.688834) {
        this.isprofile = true;
      } else {
        this.isprofile = false;
      }

    } else if (window.innerWidth <= 1200) {

      if (scrolltotop.scrollTop > 73.048098) {
        this.isprofile = true;
      } else {
        this.isprofile = false;
      }

    } else if (window.innerWidth <= 1024) {

      if (scrolltotop.scrollTop > 66.407362) {
        this.isprofile = true;
      } else {
        this.isprofile = false;
      }

    } else if (window.innerWidth <= 768) {

      if (scrolltotop.scrollTop > 53.125889) {
        this.isprofile = true;
      } else {
        this.isprofile = false;
      }
    } else {
      this.isprofile = false;
    }
  }

  public clicktotop() {
    var scrolltotop = document.getElementById("menubottom");
    scrolltotop.scrollTop = 0
  }

  public roomSticky() {
    var scrolltotop = document.getElementById("menubottom");
    var roomsticky = document.getElementById("style-1");
    var roomsticky2 = document.getElementById("style-2");
    var room = document.getElementById("room");
    var x = document.getElementById("style-1");
    var i;
    if (x != undefined || y != null) {
      var y = x.getElementsByClassName("room-button");
      if (scrolltotop.scrollTop > 449) {
        roomsticky.classList.add("mystyle");
        roomsticky2.classList.add("mystyle2");
        for (i = 0; i < y.length; i++) {
          y[i].classList.add("room-sticky");
        }
      } else {
        roomsticky.classList.remove("mystyle");
        roomsticky2.classList.remove("mystyle2");
        for (i = 0; i < y.length; i++) {
          y[i].classList.remove("room-sticky");
        }
      }
    }
  }


  ngOnInit() {
  }

}

export * from './main.internal/debate.internal/debate';
export * from './main.internal/proposal.internal/proposal';
export * from './main.internal/vote.internal/vote';
export * from './main.internal/content.internal/content';
export * from './main.internal/HomePage.component';
export * from './main.internal/DebatePage.component';
export * from './main.internal/LoginPage.component';
export * from './main.internal/ProfileUserPage.component'
export * from './main.internal/RoomPage.component';
export * from './main.internal/VoteCommentPage.component';
export * from './main.internal/RegisterPage.component';
export * from './main.internal/RegisterEmailPage.component';
export * from './main.internal/ContentPage.component';
export * from './main.internal/ProposalPage.component';
export * from './main.internal/profileuser.internal/profileuser';
