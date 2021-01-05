import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'vote-card',
  templateUrl: './VoteCard.component.html'
})
export class VoteCard {
  @Input()
  protected voteId: any = 123;
  @Input()
  protected newVote: string = "New";
  @Input()
  protected isNewVote: boolean;
  @Input()
  protected isActive: boolean;
  @Input()
  protected create: string = "10/12/2019 17:30:30";
  @Input()
  protected title: string = "ใส่หัวข้อ";
  @Input()
  protected tagline: string = "แคปชั่น";
  @Input()
  protected coverImage: string = "https://www.c-ville.com/wp-content/uploads/2019/09/Cats-660x335.jpg";
  @Input()
  protected link: string = "https://www.c-ville.com/wp-content/uploads/2019/09/Cats-660x335.jpg";
  @Input()
  protected content: string = "content content content content content content content content content content content content content content content content content";
  @Input()
  protected textBtn: string = "แสดงความคิดเห็น";
  @Input()
  protected colorTitle: string = "#000";
  @Input()
  protected colorContent: string = "#6c757d";
  @Input()
  protected bgContent: string = "#ffffff";
  @Input()
  protected bgBtn: string = "#007bff";
  @Input()
  protected class: string | [string];
  @Output() onVoteCardBtnClicked: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  voteCardBtnClick(voteId: any): void {
    this.voteId = voteId;
    this.onVoteCardBtnClicked.emit(this.voteId);
  }
}
