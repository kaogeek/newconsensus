import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivityNewsFacade } from '../../../../services/facade/ActivityNewsFacade.service';
import { ActionLogFacade } from '../../../../services/facade/ActionLogFacade.service';

const PAGE_NAME: string = 'activities';

@Component({
  selector: 'newcon-activities-detail-page',
  templateUrl: './ActivitiesDetailPage.component.html',
})
export class ActivitiesDetailPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private router: Router;
  private route: ActivatedRoute;
  private activityNewsFacade: ActivityNewsFacade;
  private actionLogFacade: ActionLogFacade;

  public activitiesId: string;
  public activitiesData: any;

  constructor(router: Router, route: ActivatedRoute, activityNewsFacade: ActivityNewsFacade, actionLogFacade: ActionLogFacade) {
    this.router = router;
    this.route = route;
    this.activityNewsFacade = activityNewsFacade;
    this.activitiesData = [];
    this.actionLogFacade = actionLogFacade;

    this.route.params.subscribe((params) => {
      this.activitiesId = params.id;
    });
  }

  public ngOnInit(): void {
    this.findIdActivities();
  }

  private findIdActivities(): void {
    this.activityNewsFacade.find(this.activitiesId).then((res) => {
      if (res != null && res !== undefined) {
        this.activitiesData = res;
      } else {
        alert("ไม่พบกิขกรรมและข่าวสาร")
        this.router.navigateByUrl("/main/content");
      }

      this.actionLogFacade.createActionLog(this.activitiesId, 'activities'); // add log
    }).catch((err) => { 
      this.router.navigateByUrl("/main/content");
    });
  }
}
