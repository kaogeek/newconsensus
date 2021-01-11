/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { SearchFilter } from '../../../../models/models';
import { ActivityNewsFacade } from '../../../../services/facade/ActivityNewsFacade.service';

const PAGE_NAME: string = 'all';

@Component({
  selector: 'newcon-activities-all-page',
  templateUrl: './ActivitiesAllPage.component.html',
})
export class ActivitiesAllPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private activityNewsFacade: ActivityNewsFacade;

  public resActivityNews: any = [];
  public swipers: any = [];

  constructor(activityNewsFacade: ActivityNewsFacade) {
    this.activityNewsFacade = activityNewsFacade;
  }

  ngOnInit(): void {
    this.searchActivityNews();
  }

  public searchActivityNews(): void {
    let filter = new SearchFilter();
    this.activityNewsFacade.search(filter).then((res) => {
      this.resActivityNews = res;
      let index = 0;
      for (let activity of this.resActivityNews) {
        if (index < 2) {
          this.swipers.push(activity);
        }
        index++;
      }
    }).catch((err) => {
      // console.log(err);
    });
  }

  public getHeightNoneListNews(): string {
    if (this.resActivityNews.length == 0) {
      return "";
    } else {
      var x = document.getElementById("news-body");
    return x.offsetHeight + "px";
    }
  }
}
