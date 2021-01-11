/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

const PAGE_NAME: string = "home_content";

@Component({
    selector: 'admin-home=content-page',
    templateUrl: './HomeContentPage.component.html'
})
export class HomeContentPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;
 
    private router: Router; 

    constructor(router: Router) { 
      this.router = router; 
     }

    public ngOnInit() {
        if(this.router.url === "/main/home_content") {
          this.router.navigateByUrl("/main/home_content/pageslide");
        }
    } 
}
 