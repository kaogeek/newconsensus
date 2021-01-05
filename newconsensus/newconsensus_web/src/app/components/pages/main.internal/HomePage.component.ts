import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { SwiperConfigInterface, SwiperScrollbarInterface, SwiperPaginationInterface, SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { Gallery, GalleryRef } from '@ngx-gallery/core';
import {
  RoomFacade, ActivityNewsFacade, MainPageVideoFacade, DebateFacade, ProposalFacade, VoteFacade,
  PageContentFacade, PageContentHasTagFacade, MainPageSlideFacade, AuthenManager
} from '../../../services/services';
import { AbstractPage } from '../AbstractPage';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { DEBATE_MENU_ENABLE, VOTE_MENU_ENABLE, PAGE_TAG_ARTICLES,PAGE_TAG_INTERVIEW,CONTENT_INTERVIEW_SHOW,CONTENT_ARCHIVE_SHOW,CONTENT_CLIP_SHOW} from '../../../Constants';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'home';
const TAG_ARTICLES: string = '1'; //บทความ
const TAG_INTERVIEWS: string = '2'; //บทสัมภาษณ์
const PAGE_SIZE: number = 6;

@Component({
  selector: 'newcon-home-page',
  templateUrl: './HomePage.component.html',
})
export class HomePage extends AbstractPage implements OnInit {

  private roomFacade: RoomFacade;
  private activityNewFacade: ActivityNewsFacade;
  private mainPageVideoFacade: MainPageVideoFacade;
  private debateFacade: DebateFacade;
  private proposalFacade: ProposalFacade;
  private voteFacade: VoteFacade;
  private hasTagFacade: PageContentHasTagFacade;
  private pageContentFacade: PageContentFacade;
  private pageSlideFacade: MainPageSlideFacade;
  private cacheConfigInfo: CacheConfigInfo;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  @ViewChild("paginator", { static: false }) public paginator: MatPaginator;

  public hide = true;
  public email: string = '';
  public password: string = '';
  public room: any;
  public resRoom: any = [];
  public resActivity: any = [];
  public resTag: any = [];
  public resVideo: any = [];
  public resDebateHot: any = [];
  public resProposalHot: any = [];
  public resVoteHot: any = [];
  public resArticles: any = [];
  public resInterview: any = [];
  public contentInterview = [];
  public topicprofilepopular1 = [];
  public topicprofilepopular2 = [];
  public topicprofilepopular3 = [];
  public contentPage = [];
  public tagIdArticles : string;
  public tagName = [];
  public mainVideo = [];
  public result = [];
  public contentArticles = [];
  public test: any;
  public pageSize: number = PAGE_SIZE;
  public isShowDebate: boolean;
  public isShowVote: boolean;
  public isShowinterview: boolean;
  public isShowarchive: boolean;
  public isShowclip: boolean;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  galleryId = 'mixedExample';
  loadLogin: boolean = false;

  //Start slider top-------------------------------------
  public slides = [];

  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true, hideOnClick: false, },
    loop: true,
    spaceBetween: 10,
    watchOverflow: true,
    autoplay: { delay: 8000, stopOnLastSlide: false, reverseDirection: false, disableOnInteraction: false },
  };

  @ViewChild(SwiperComponent, { static: false }) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective, { static: false }) directiveRef: SwiperDirective;
  @ViewChild("swiperVote", { static: false }) swiperVote: ElementRef;
  //End slider top------------------------------

  //Start slider vote--------------------------
  public slides2 = [
    "https://thaipublica.org/wp-content/uploads/2018/03/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%A3-620x409.jpg",
    "https://kdcdn.co/wp-content/uploads/354354-1.jpg",
    "https://thepeople.co/wp-content/uploads/2019/01/%E0%B8%9E%E0%B8%A5.%E0%B8%AD.%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%A3-%E0%B8%A7%E0%B8%87%E0%B8%A9%E0%B9%8C%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93_Website_1200x628.jpg"
  ];
  public config2: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: { nextEl: '.swiper-button-next2', prevEl: '.swiper-button-prev2' },
    pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true, hideOnClick: false, },
    loop: true,
    spaceBetween: 10,
    watchOverflow: true,
    autoplay: { delay: 8000, stopOnLastSlide: false, reverseDirection: false, disableOnInteraction: false },
    touchMoveStopPropagation: true
  };
  //End slider vote--------------------------

  //Start news-and-activities vote--------------------------
  public imageUrl = [];

  public config3: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: { nextEl: '.swiper-button-next3', prevEl: '.swiper-button-prev3' },
    pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true, hideOnClick: false, },
    loop: true,
    spaceBetween: 10,
    watchOverflow: true,
    autoplay: { delay: 8000, stopOnLastSlide: false, reverseDirection: false, disableOnInteraction: false },
  };

  //End news-and-activities vote--------------------------

  constructor(private gallery: Gallery, router: Router, roomFacade: RoomFacade, activityNewFacade: ActivityNewsFacade,
    mainPageVideoFacade: MainPageVideoFacade, debateFacade: DebateFacade, proposalFacade: ProposalFacade, voteFacade: VoteFacade, hasTagFacade: PageContentHasTagFacade,
    pageContentFacade: PageContentFacade, pageSlideFacade: MainPageSlideFacade, authenManager: AuthenManager, dialog: MatDialog, cacheConfigInfo: CacheConfigInfo) {
    super(null, authenManager, dialog, router);
    this.roomFacade = roomFacade;
    this.activityNewFacade = activityNewFacade;
    this.mainPageVideoFacade = mainPageVideoFacade;
    this.debateFacade = debateFacade;
    this.proposalFacade = proposalFacade;
    this.voteFacade = voteFacade;
    this.hasTagFacade = hasTagFacade;
    this.pageContentFacade = pageContentFacade;
    this.pageSlideFacade = pageSlideFacade;
    this.room = [];
    this.isShowDebate = false;
    this.isShowVote = false;
    this.isShowinterview = false;
    this.isShowarchive = false;
    this.isShowclip = false;

    this.cacheConfigInfo = cacheConfigInfo;

    this.cacheConfigInfo.getConfig(DEBATE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowDebate = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });

    this.cacheConfigInfo.getConfig(VOTE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowVote = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });

    this.cacheConfigInfo.getConfig(CONTENT_INTERVIEW_SHOW).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowinterview = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });

    this.cacheConfigInfo.getConfig(CONTENT_ARCHIVE_SHOW).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowarchive = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });

    this.cacheConfigInfo.getConfig(CONTENT_CLIP_SHOW).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowclip = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });

  }

  ngOnInit(): void {
    super.ngOnInit();
    this.searchActvity();
    this.searchVideo();
    this.searchDebateHot();
    this.searchProposalHot();
    this.searchVoteHot();
    this.searchInterview();
    this.searchArticles();
    this.searchPageSlide();
    this.searchRoom();

  }

  public onClickLogin() {

  }

  public searchActvity(): void {
    let filter = {
      limit: 5,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: [],

      orderBy: {
        "createdDate": "DESC"
      },

      count: false,
    }
    this.activityNewFacade.search(filter).then((res) => {
      this.resActivity = res;
      for (let image of this.resActivity) {
        this.imageUrl.push(image.coverImageUrl);
      }
    }).catch((err) => {
      // console.log(err);
    });;
  }

  public searchVideo(): void {
    let filter = {
      limit: 5,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: "ordering > 0",

      orderBy: {
        "ordering": "ASC"
      },

      count: false,
    }
    this.mainPageVideoFacade.search(filter).then((res) => {
      this.mainVideo = res;
      const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
      for (let data of this.mainVideo) {
        var video = data.url;
        this.resVideo = this.extractVideoID(video);
        galleryRef.addYoutube({
          src: this.resVideo
        });
      }

    }).catch((err) => {
      // console.log(err);
    });
  }

  public extractVideoID(url: string) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
      return match[7];
    } else {
      return "Could not extract video ID.";
    }
  }

  public searchPageSlide(): void {
    let filter = {
      limit: undefined,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: "image_url != '' and image_url is NOT NULL and ordering > 0",

      orderBy: {
        "ordering": "ASC"
      },

      count: false,
    }

    this.slides = [];
    this.pageSlideFacade.search(filter).then((res) => {
      if (res && Array.isArray(res)) {
        for (const item of res) {
          this.slides.push(item.imageUrl);
        }
      }
    }).catch((err) => {
      // console.log(err);
    });
  }

  public searchDebateHot() {
    this.debateFacade.searchHot(5).then((res) => {
      this.resDebateHot = res;

    }).catch((err) => {
      // console.log(err);
    });
  }

  public searchProposalHot() {
    this.proposalFacade.searchHot(false, undefined, undefined, 5).then((res) => {
      this.resProposalHot = res;

    }).catch((err) => {
      // console.log(err);
    });
  }

  public searchVoteHot() {
    this.voteFacade.searchHot(undefined, 5).then((res) => {
      this.resVoteHot = res;

    }).catch((err) => {
      // console.log(err);
    });
  }
  //บทสัมภาษณ์
  public searchInterview(): void {
    this.cacheConfigInfo.getConfig(PAGE_TAG_INTERVIEW).then((config: any) => {
      let tagIds = TAG_INTERVIEWS;
      if (config.value !== undefined && config.value !== null) {
        tagIds = (config.value.toLowerCase());
        this.hasTagFacade.find(tagIds).then((res) => {
          this.resInterview = res;
          for (let data of this.resInterview) {
            if (data.tagId == tagIds) {
              this.contentPage.push({
                id: data.pageId
              });
            }
          }
          if (this.resInterview != '') {
            this.getPageContent(this.contentPage).then((valueList: any) => {
              for (let data of valueList) {
                if (data.is_draft == 0) {
                  this.contentInterview = valueList;
                }
              }
            });
          }
        });
      }
    }).catch((error: any) => {
      console.log(error)
    });
  }
  //บทความ
  public searchArticles(): void {
    this.cacheConfigInfo.getConfig(PAGE_TAG_ARTICLES).then((config: any) => {
    let tagId = TAG_ARTICLES;
    tagId = (config.value.toLowerCase());
    this.hasTagFacade.find(tagId).then((res) => {
      this.resArticles = res;
      for (let data of this.resArticles) {
        if (data.tagId == tagId) {
          this.result.push({
            id: data.pageId
          });
        }
      }
      if (this.resArticles != '') {
        this.getPageContent(this.result).then((value: any) => {
          for (let data of value) {
            if (data.is_draft == 0) {
              this.contentArticles = value;
            }
          }
        });
      }
    });
  }).catch((error: any) => {
    console.log(error)
  });
  }

  public findAndReplace(string, target, replacement) {
    var i = 0; length = string.length;
    for (i; i < length; i++) {
      string = string.replace(target, replacement);
    }
    return string;
  }

  public getPageContent(id: any) {
    let filter = {
      limit: 5,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: id,

      orderBy: {
        "createdDate": "DESC"
      },

      count: false,

    }
    return this.pageContentFacade.search(filter, true);
  }

  /**
   * isStopSwiper
   */
  public isStopSwiper(isStop: boolean) {
    if (isStop) {
      this.config2.autoplay = false;
    } else {
      this.config2.autoplay = { delay: 8000, stopOnLastSlide: false, reverseDirection: false, disableOnInteraction: false }
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
  public searchRoom(): void {
    let filter = {
      limit: 10,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: [],

      orderBy: "",

      count: false,
    }
    this.roomFacade.search(filter).then((res) => {
      this.room = this.room.concat(res);
    }).catch((err) => {
      // console.log(err);
    });
  }
  public getHeightNoneListresDebateHot(): string {
    if(this.topicprofilepopular1.length == 0){
      return "";
    } else{
      var x = document.getElementById("topic-profile-popular-1");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListresProposalHot(): string {
    if(this.topicprofilepopular2.length == 0){
      return "";
    } else{
      var x = document.getElementById("topic-profile-popular-2");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListresVote(): string {
    if(this.topicprofilepopular3.length == 0){
      return "";
    } else{
      var x = document.getElementById("topic-profile-popular-3");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListactivities(): string {
    if (this.imageUrl.length == 0) {
      return "";
    } else {
      var x = document.getElementById("newcon-news-and-activities-sliders");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListInterView(): string {
    if (this.contentInterview.length == 0) {
      return "";
    } else {
      var x = document.getElementById("contentInterview");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListArticles(): string {
    if (this.contentArticles.length == 0) {
      return "";
    } else {
      var x = document.getElementById("contentArticles");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListVideo(): string {
    if (this.mainVideo.length == 0) {
      return "";
    } else {
      var x = document.getElementById("newcon-video-body");
      return x.offsetHeight + "px";
    }
  }
}
