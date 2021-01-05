import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Proposal } from '../../../../models/Proposal';


const PAGE_NAME: string = 'edit';

@Component({
  selector: 'newcon-proposal-edit-page',
  templateUrl: './ProposalEditPage.component.html',
})
export class ProposalEditPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME; 

  public proposal: Proposal;
  public debateTag: string;


  constructor(public dialog: MatDialog) { 
    this.proposal = new Proposal();
    this.debateTag = '';
  }

  public ngOnInit() {

  }


}
