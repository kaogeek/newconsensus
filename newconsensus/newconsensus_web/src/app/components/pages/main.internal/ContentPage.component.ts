/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';

const PAGE_NAME: string = 'content';


@Component({
  selector: 'newcon-content-page',
  templateUrl: './ContentPage.component.html',
})
export class ContentPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  ngOnInit() {
  }
}




