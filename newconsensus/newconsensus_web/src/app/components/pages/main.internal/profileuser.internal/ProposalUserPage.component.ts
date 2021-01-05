import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenManager, ObservableManager, ProposalFacade, ProposalCommentFacade } from '../../../../services/services';
import { DialogEditComment } from 'src/app/components/shares/dialog/dialog';
import { SearchFilter } from '../../../../models/models';
import { AbstractPage } from '../../AbstractPage';
import { MESSAGE } from '../../../../AlertMessage';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'proposaluser';
const SEARCH_LIMIT: number = 50;
const PAGE_SIZE: number = 5;
const PAGESIZE_OPTIONS: number[] = [5];

@Component({
  selector: 'newcon-proposal-user-page',
  templateUrl: './ProposalUserPage.component.html',
})
export class ProposalUserPage extends AbstractPage implements OnInit {

  private observManager: ObservableManager;
  private proposalFacade: ProposalFacade;
  private proposalCommentFacade: ProposalCommentFacade;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public pageSizeOptions: number[] = PAGESIZE_OPTIONS;
  public pageSize: number = PAGE_SIZE;
  public resProposal: any;
  public resProposalUnApprove: any;
  public resProposalComment: any;
  public isLoadingProposal: boolean;
  public dataEditProposal: any;

  constructor(authenManager: AuthenManager, router: Router, observManager: ObservableManager, proposalFacade: ProposalFacade,
    proposalCommentFacade: ProposalCommentFacade, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);

    this.observManager = observManager;
    this.proposalFacade = proposalFacade;
    this.proposalCommentFacade = proposalCommentFacade;
    this.resProposal = [];
    this.resProposalUnApprove = []
    this.resProposalComment = [];

    this.observManager.subscribe('authen.check', (data: any) => {
      // this.searchProposal();
      // this.searchProposalUnapprove();
      // this.searchProposalComment();
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.searchProposal();
    this.searchProposalUnapprove();
    this.searchProposalComment();
    this.checkAccountStatus().then((res)=>{
      if(!res){
        this.observManager.publish("authen.logout", true);
      }
    });
  }

  private stopLoading(): void {
    setTimeout(() => {
      this.isLoadingProposal = false;
    }, 500);
  }

  private removeComment(data: any) {
    if (data === undefined) {
      return;
    }

    if (this.resProposalComment && this.resProposalComment.length > 0) {
      let index = this.resProposalComment.map((item: any) => {
        return item.proposalId + ':' + item.id;
      }).indexOf(data.proposalId + ':' + data.id);

      if (index < this.resProposalComment.length) {
        this.resProposalComment.splice(index, 1);
      }
    }
  }

  private updateComment(data: any) {
    if (data === undefined) {
      return;
    }

    if (this.resProposalComment && this.resProposalComment.length > 0) {
      let index = this.resProposalComment.map((item: any) => {
        return item.proposalId + ':' + item.id;
      }).indexOf(data.proposalId + ':' + data.id);

      if (index < this.resProposalComment.length) {
        this.resProposalComment[index].comment = data.comment;
      }
    }
  }

  public searchProposal(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.resProposal.length;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.orderBy = {
        'createdDate': 'DESC'
      };
      filter.count = false;
      this.isLoadingProposal = true;
      this.proposalFacade.search(filter, false, true, "approve").then((res: any) => {
        this.resProposal = res;
      })
    }
  }

  public searchProposalUnapprove(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.resProposalUnApprove.length;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.orderBy = {
        'createdDate': 'DESC'
      };
      filter.count = false;
      this.proposalFacade.search(filter, false, true, "unapprove", true).then((res: any) => {
        this.resProposalUnApprove = res;
      })
    }
  }

  public searchProposalComment(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.resProposalComment.length;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.orderBy = {
        'createdDate': 'DESC'
      };
      filter.count = false;
      
      this.isLoadingProposal = true;
      this.proposalCommentFacade.searchUserProposalComment(filter, true).then((res: any) => {
        for (let proposal of res) {
          this.resProposalComment.push(proposal);
        }
        this.stopLoading();
      }).catch((error: any) => {
        this.stopLoading();
      })
    }
  }

  public editCardProposal(data: any): void {
    this.dataEditProposal = JSON.parse(JSON.stringify(data));
  }

  public saveCardProposal(data: any): void {
    this.proposalFacade.edit(data.id, data).then(() => {

      this.proposalFacade.find(data.id).then((resultWithDebates: any)=>{
        // find & update proposal
        const index = this.resProposalUnApprove.map((item: any) => {
          return item.id;
        }).indexOf(data.id);

        if (index >= 0) {
          this.resProposalUnApprove[index] = resultWithDebates;
        }

        this.clearCardProposal();
      });

    }).catch((error: any) => {
      this.showAlertDialog('Error : ' + JSON.stringify(error));
      this.clearCardProposal();
    });
  }

  public clearCardProposal(): void {
    this.dataEditProposal = undefined;
  }

  public deleteCardProposalComment(data: any) {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.proposalCommentFacade.delete(data.proposalId, data.id).then((result: any) => {
        this.removeComment(data);
      }).catch((error: any) => {
        this.stopLoading();
      });
    });

    this.showDialogWithOptions({
      text: MESSAGE.TEXT_DELETE_CONTENT,
      bottomText1: MESSAGE.TEXT_BUTTON_CANCEL,
      bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
      bottomColorText2: "black",
      confirmClickedEvent: confirmEventEmitter,
    }
    );
  }

  public editCardProposalComment(data: any) {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe((result: any) => {
      const cloneData = JSON.parse(JSON.stringify(data));
      cloneData.comment = result.text;

      this.proposalCommentFacade.edit(data.proposalId, data.id, cloneData).then((result: any) => {
        // update comments
        this.updateComment(result);
      }).catch((error: any) => {
        this.showAlertDialog('Error : ' + JSON.stringify(error));
      });
    });

    this.dialog.open(DialogEditComment, {
      disableClose: true,
      data: {
        text: (data.comment) ? data.comment : '',
        confirmClickedEvent: confirmEventEmitter
      }
    });
  }

  public isShowProposalEditIcon: Function = function(data: any) {
    if (data !== undefined && data !== null) {
      return (data.approveUserId === undefined || data.approveUserId === null || data.approveUserId === '');
    }

    return false;
  };
}

export * from './proposal.internal/EditUserProposal.component';
export * from './debate.internal/EditUserDebate.component';
