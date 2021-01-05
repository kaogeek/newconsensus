import { Component, OnInit } from '@angular/core';

const PAGE_NAME: string = 'proposal';

@Component({
  selector: 'newcon-proposal-page',
  templateUrl: './ProposalPage.component.html',
})
export class ProposalPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME; 
 
  ngOnInit() { 
  }

}


