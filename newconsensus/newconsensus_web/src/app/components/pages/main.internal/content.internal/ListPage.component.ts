/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFilter } from 'src/app/models/models';
import { PageContentFacade, PageContentHasTagFacade } from '../../../../services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';


const PAGE_NAME: string = 'list';
const SEARCH_LIMIT: number = 10;
const SEARCH_OFFSET: number = 0;
const TAG_ARTICLES: string = '1'; //บทความ
const TAG_INTERVIEWS: string = '2'; //บทสัมภาษณ์
const PAGE_SIZE: number = 9;


@Component({
  selector: 'newcon-content-list-all-page',
  templateUrl: './ListPage.component.html',
})
export class ListPage implements OnInit {

  @ViewChild("paginator", { static: false }) public paginator: MatPaginator;
  private hasTagPageFacade: PageContentHasTagFacade;
  private pageContentFacade: PageContentFacade;
  private activatedRoute: ActivatedRoute;
  private mode: string;
  private router: Router;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public pageSize: number = PAGE_SIZE;
  public resData: any = [];
  public resultPage: any = [];
  public resList: any = [];
  public data: any = [];

  constructor(hasTagPageFacade: PageContentHasTagFacade, pageContentFacade: PageContentFacade, activatedRoute: ActivatedRoute, router: Router) {
    this.pageContentFacade = pageContentFacade;
    this.hasTagPageFacade = hasTagPageFacade;
    this.activatedRoute = activatedRoute;
    this.router = router;

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mode'] === 'interview') {
        this.mode = "interview";
      } else if (params['mode'] === 'articles') {
        this.mode = "articles";
      } else if (params['mode'] === 'all') {
        this.mode = "all";
      } else {
        this.router.navigateByUrl("/main/content");
      }
    });
  }

  ngOnInit(): void {
    if (this.mode === "interview") {
      this.pageContentInterview();
    } else if (this.mode === "articles") {
      this.pageContentArticle();
    } else if (this.mode === "all") {
      this.pageContentAll();
    }
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
  public pageContentInterview(): void {
    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.relation = ["pageContent"];
    filter.whereConditions = [{
      tagId: TAG_INTERVIEWS
    }];
    filter.count = false;
    this.hasTagPageFacade.searchHasTag(filter).then((res: any) => {
      this.resData = res;
      for (let data of this.resData) {
        if (data.tagId == TAG_INTERVIEWS) {
          this.resultPage.push({
            id: data.pageId
          });
        }
      }
      if (this.resData != null) {
        this.getPageContent(this.resultPage).then((valueList: any) => {
          this.resList = valueList;
        }).catch((err) => {
          // console.log(err);
        });
      }
    }).catch((err) => {
      // console.log(err);
    });

  }

  public pageContentArticle(): void {
    this.resList = [];
    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.relation = ["pageContent"];
    filter.whereConditions = [{
      tagId: TAG_INTERVIEWS
    }];
    filter.count = false;
    this.hasTagPageFacade.searchHasTag(filter, true).then((res: any) => {
      this.resData = res;
      for (let data of this.resData) {
        this.resultPage.push({
          id: data.pageId
        });
      }
      if (this.resData != null) {
        this.getPageContent(this.resultPage).then((valueList: any) => {
          this.resList = valueList;
        }).catch((err) => {
          // console.log(err);
        });
      }
    }).catch((err) => {
      // console.log(err);
    });

  }

  public pageContentAll(): void {
    this.resList = [];
    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.relation = ["pageContent"];
    filter.count = false;
    this.hasTagPageFacade.searchHasTag(filter).then((res: any) => {
      this.resData = res;
      for (let data of this.resData) {
        this.resultPage.push({
          id: data.pageId
        });
      }
      if (this.resData != null) {
        this.getPageContent(this.resultPage).then((valueList: any) => {
          this.resList = valueList;
        }).catch((err) => {
          // console.log(err);
        });
      }
    }).catch((err) => {
      // console.log(err);
    });

  }

  public getPageContent(id: any) {
    let filter = {
      limit: SEARCH_LIMIT,

      offset: SEARCH_OFFSET,

      select: [],

      relation: [],

      whereConditions: id,

      orderBy: "",

      count: false,
    }
    return this.pageContentFacade.search(filter, true);
  }
}
