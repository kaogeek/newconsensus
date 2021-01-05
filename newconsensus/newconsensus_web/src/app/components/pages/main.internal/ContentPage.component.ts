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




