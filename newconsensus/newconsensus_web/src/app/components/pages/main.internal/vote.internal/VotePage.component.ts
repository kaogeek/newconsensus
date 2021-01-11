/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, ViewChild } from '@angular/core';
import { VoteFacade } from '../../../../services/services';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material';
import { AbstractPage } from '../../AbstractPage';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'vote';
const SEARCH_LIMIT: number = 20;
const SEARCH_OFFSET: number = 0;
const PAGE_SIZE: number = 9;

@Component({
  selector: 'newcon-vote-page',
  templateUrl: './VotePage.component.html',
})
export class VotePage extends AbstractPage implements OnInit {

  @ViewChild("paginator", { static: false }) public paginator: MatPaginator;
  public static readonly PAGE_NAME: string = PAGE_NAME;
  private voteFacade: VoteFacade;
  public vote: any = [];
  public today: string;
  public pageSize: number = PAGE_SIZE;

  constructor(voteFacade: VoteFacade, router: Router) {
    super(null, null, null, router);
    this.voteFacade = voteFacade;
    this.today = moment().format("YYYY-MM-DD");
  }

  ngOnInit() {
    super.ngOnInit();
    this.getAllVote();
  }

  private getAllVote(): void {
    let dateStmt: string = 'end_date IS NULL OR (end_date IS NOT NULL AND end_date >= ' + '"' + this.today + '")';

    let filter = {
      limit: SEARCH_LIMIT,
      offset: SEARCH_OFFSET,
      select: [],
      relation: [],
      whereConditions: dateStmt,
      orderBy: {
        "createdDate": "DESC"
      },
      count: false,
    }

    this.voteFacade.search(filter).then((res) => {
      this.vote = res;
    }).catch((err) => {
      // console.log(err);
    });
  }
  public isShow(index): boolean {
    let page = this.paginator.pageIndex;
    let itemStart = ((page + 1) * this.pageSize) - this.pageSize;
    let itemEnd = ((page + 1) * this.pageSize) - 1;
    if (itemStart <= index && itemEnd >= index) {
      return true;
    }
    return false
  }
}
