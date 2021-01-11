/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperConfigInterface, SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { Gallery, GalleryRef } from '@ngx-gallery/core';
import { PageContentFacade } from 'src/app/services/facade/PageContentFacade.service';
import { PageContentHasTagFacade, ActivityNewsFacade, MainPageVideoFacade } from '../../../../services/services';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { PAGE_TAG_ARTICLES, PAGE_TAG_INTERVIEW, CONTENT_INTERVIEW_SHOW, CONTENT_ARCHIVE_SHOW, CONTENT_CLIP_SHOW } from '../../../../Constants';

const PAGE_NAME: string = 'main';
const TAG_ARTICLES: string = '1'; //บทความ
const TAG_INTERVIEWS: string = '2'; //บทสัมภาษณ์
//Start slider -------------------------------------

@Component({
  selector: 'newcon-content-main-page',
  templateUrl: './ContentMainPage.component.html',
})
export class ContentMainPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private pageContentFacade: PageContentFacade;
  private hasTagFacade: PageContentHasTagFacade;
  private pageActivitesFacade: ActivityNewsFacade;
  private mainPageVideoFacade: MainPageVideoFacade;
  private cacheConfigInfo: CacheConfigInfo;

  public resPageContent: any = [];
  public resInterview: any = [];
  public resResult: any = [];
  public resData: any = [];
  public videoUrl: any = [];
  public resArticles: any = [];
  public resVideo: any = [];
  public contentPage = [];
  public contentArticles = [];
  public contentData = [];
  public contentResult = [];
  public contentInterview = [];
  public result = [];
  public mainVideo = [];
  public hide = true;
  public email: string = '';
  public password: string = '';
  public isShowinterview: boolean;
  public isShowarchive: boolean;
  public isShowclip: boolean;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  galleryId = 'mixedExample';

  public testD = [];

  loadLogin: boolean = false;

  @ViewChild(SwiperComponent, { static: false }) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective, { static: false }) directiveRef: SwiperDirective;
  //End slider ------------------------------

  //Start slider vote--------------------------
  public coverImage = [];

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
  };
  //End slider vote--------------------------

  constructor(private gallery: Gallery, pageContentFacade: PageContentFacade, hasTagFacade: PageContentHasTagFacade,
    pageActivitesFacade: ActivityNewsFacade, mainPageVideoFacade: MainPageVideoFacade, cacheConfigInfo: CacheConfigInfo) {
    this.pageContentFacade = pageContentFacade;
    this.hasTagFacade = hasTagFacade;
    this.pageActivitesFacade = pageActivitesFacade;
    this.mainPageVideoFacade = mainPageVideoFacade;
    this.cacheConfigInfo = cacheConfigInfo;

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
    this.searchVideo();
    this.searchActivites();
    this.searchArticles();
    this.searchInterview();
    this.searchContentPage();
  }
  public searchActivites(): void {
    let filter = {
      limit: 5,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: [],

      orderBy: "",

      count: false,
    }
    this.pageActivitesFacade.search(filter).then((res) => {
      this.resPageContent = res;
      for (let image of this.resPageContent) {
        this.coverImage.push({
          image: image.coverImageUrl,
          title: image.title,
          id: image.id
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

    // let filter = {
    //   limit: 0,

    //   offset: 0,

    //   select: [],

    //   relation: ["pageContent"],

    //   whereConditions: [{ tagId: TAG_ARTICLES }],

    //   orderBy: "",

    //   count: false,
    // }
    // this.hasTagFacade.searchHasTag(filter, true).then((res) => {
    //   this.resArticles = res;
    //   for (let data of this.resArticles) {
    //     if (data.tagId == TAG_ARTICLES) {
    //       this.contentPage.push({
    //         id: data.pageId
    //       });
    //     }
    //   }
    //   if (this.resArticles != null) {
    //     this.getPageContent(this.contentPage).then((valueList: any) => {
    //       this.contentArticles = valueList;
    //     });
    //   }
    // })
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


    // let filter = {
    //   limit: 0,

    //   offset: 0,

    //   select: [],

    //   relation: ["pageContent"],

    //   whereConditions: [{ tagId: TAG_INTERVIEWS }],

    //   orderBy: "",

    //   count: false,
    // }
    // this.hasTagFacade.searchHasTag(filter).then((res) => {
    //   this.resInterview = res;
    //   for (let data of this.resInterview) {
    //     if (data.tagId == TAG_INTERVIEWS) {
    //       this.result.push({
    //         id: data.pageId
    //       });
    //     }
    //     if (this.resInterview != null) {
    //       this.getPageContent(this.result).then((value: any) => {
    //         this.contentInterview = value;
    //       });
    //     }
    //   }
    // });
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
  public searchContentPage(): void {
    let filter = {
      limit: 4,

      offset: 0,

      select: [],

      relation: [],

      whereConditions: [],

      orderBy: {
        "createdDate": "DESC"
      },

      count: false,
    }
    this.pageContentFacade.search(filter, false).then((res) => {
      this.resData = res;
      for (let image of this.resData) {

        this.contentData.push(image);
      }
    }).catch((err) => {
      // console.log(err);
    });
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

  public getHeightNoneListInternewsandactivities(): string {
    if (this.coverImage.length == 0) {
      return "";
    } else {
      var x = document.getElementById("content-1-body");
      return x.offsetHeight + "px"
    }
  }

  public getHeightNoneListInterViewcontentDataleft(): string {
    if (this.contentData.length == 0) {
      return "";
    } else {
      var x = document.getElementById("content2bodyleft");
      return x.offsetHeight + "px"
    }
  }

  public getHeightNoneListInterViewcontentDataright(): string {
    if (this.contentData.length == 0) {
      return "";
    } else {
      var x = document.getElementById("content2bodyright");
      return x.offsetHeight + "px"
    }
  }

  public getHeightNoneListVideo(): string {
    if (this.mainVideo.length == 0) {
      return "";
    } else {
      var x = document.getElementById("content-3-body");
      return x.offsetHeight + "px"
    }
  }

  public getHeightNoneListArticles(): string {
    if (this.contentInterview.length == 0) {
      return "";
    } else {
      var x = document.getElementById("contentInterview");
      return x.offsetHeight + "px";
    }
  }

  public getHeightNoneListInterView(): string {
    if (this.contentArticles.length == 0) {
      return "";
    } else {
      var x = document.getElementById("contentArticles");
      return x.offsetHeight + "px";
    }
  }
}
