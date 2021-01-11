/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { SearchFilter } from '../../../../models/SearchFilter';
import { MainPageSlideFacade } from '../../../../services/facade/MainPageSlideFacade.service';
import { PageSlide } from '../../../../models/PageSlide';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DialogWarningComponent } from '../../../shares/DialogWarningComponent.component';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

const PAGE_NAME: string = "pageslide";

@Component({
    selector: 'admin-pageslide-page',
    templateUrl: './MainPageSlidePage.component.html'
})
export class MainPageSlidePage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private pageSlideFacade: MainPageSlideFacade;

    public dataForm: PageSlide;
    public slideActive: PageSlide[] = [];
    public slideActiveOriginal: PageSlide[] = [];
    public slideList: PageSlide[] = [];
    public isEditActive: boolean;
    public submitted: boolean;
    public isShowPreview: boolean = false;
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

    constructor(pageSlideFacade: MainPageSlideFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.pageSlideFacade = pageSlideFacade;
        this.setFields();
    }

    public ngOnInit() {
        this.loadSlideActive();
        this.loadSlideList();
    }

    private setFields(): void {
        this.fields = [
            {
                name: "รูป",
                field: "imageUrl",
                type: "textarea",
                placeholder: "http://example.com",
                required: true,
                disabled: false
            }
        ];
        this.dataForm = new PageSlide();
        this.dataForm.videoUrl = null;
        this.dataForm.imageUrl = "";
        this.dataForm.ordering = null;
        this.dataForm.delayMiliSec = null;
        this.dataForm.isAutoPlay = false;
    }
    
    private sortSlideActive(a, b) {
        if (a.ordering > b.ordering) return 1;
        if (b.ordering > a.ordering) return -1;

        return 0; 
    }

    public isEditOrdering(): boolean {
        let slideActiveOriginal: any = JSON.parse(JSON.stringify(this.slideActiveOriginal));
        let slideActive: any = JSON.parse(JSON.stringify(this.slideActive));
        if (slideActive.length !== slideActiveOriginal.length) {
            return true;
        } else {
            let index = 0;
            for (const a of slideActive) {
                if (a.id !== slideActiveOriginal[index].id) {
                    return true;
                }
                index++;
            }
            return false;
        }
    }

    public isPreview(): boolean {
        let slideActive: any = JSON.parse(JSON.stringify(this.slideActive));
        return slideActive.length > 0 ? true : false;
    }

    public dropSlide(event: CdkDragDrop<{ title: string, poster: string }[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    public loadSlideActive(): void {
        let search: SearchFilter = new SearchFilter();
        search.whereConditions = "ordering >= 0";
        search.orderBy = {
            ordering: "asc"
        };
        search.count = false;
        this.pageSlideFacade.search(search).then((res: any) => {
            res.sort(this.sortSlideActive);
            this.slideActiveOriginal = JSON.parse(JSON.stringify(res));
            this.slideActive = JSON.parse(JSON.stringify(res));
        }).catch((err: any) => {
            console.log(err);
        });
    }

    public loadSlideList(): void {
        let search: SearchFilter = new SearchFilter();
        search.whereConditions = { ordering: null };
        search.count = false;
        this.pageSlideFacade.search(search).then((res: any) => {
            this.slideList = res;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    public clickCreateForm(): void {
        this.drawer.toggle();
        this.setFields();
    }

    public clickEditForm(data: any, isEditActive: boolean): void {
        this.isEditActive = isEditActive;
        this.dataForm = JSON.parse(JSON.stringify(data));
        this.drawer.toggle();
    }

    public clickPreview(): void {
        this.isShowPreview = !this.isShowPreview;
    }

    public clickDelete(): void {
        if (!this.dataForm.id) {
            return;
        }
        let dialogRef = this.dialog.open(DialogWarningComponent, {
            data: {
                title: "คุณต้องการที่จะลบข้อมูลนี้ ?"
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.pageSlideFacade.delete(this.dataForm.id).then((res) => {
                    let index = 0;
                    let data = this.isEditActive ? this.slideActive : this.slideList;
                    for (let d of data) {
                        if (d.id == this.dataForm.id) {
                            data.splice(index, 1);
                            if (this.isEditActive) {
                                this.slideActiveOriginal = JSON.parse(JSON.stringify(this.slideActive));
                            }
                            this.drawer.toggle();
                            this.dialogWarning("ลบข้อมูลสำเร็จ");
                            break;
                        }
                        index++;
                    }
                }).catch((err) => {
                    this.dialogWarning(err.error.message);
                });
            }
        });
    }

    public clickSaveOrdering(): void {
        if (this.isEditOrdering) {
            let slideActives: PageSlide[] = [];
            let index = 1;
            for (const data of this.slideActive) {
                data.ordering = index;
                slideActives.push(data);
                index++;
            }
            this.pageSlideFacade.ordering({ data: slideActives }).then((res) => {
                this.slideActiveOriginal = JSON.parse(JSON.stringify(this.slideActive));
                this.dialogWarning("บันทึกข้อมูลสำเร็จ");
            }).catch((err) => {
                this.slideActive = JSON.parse(JSON.stringify(this.slideActiveOriginal));
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickSave(): void {
        this.submitted = true;
        if (this.dataForm.imageUrl.trim() === "") {
            return;
        }
        if (this.dataForm.id !== undefined && this.dataForm.id !== null) {
            this.pageSlideFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
                let index = 0;
                let data = this.isEditActive ? this.slideActive : this.slideList;
                for (let d of data) {
                    if (d.id == res.id) {
                        data[index] = res;
                        break;
                    }
                    index++;
                }
                this.submitted = false;
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        } else {
            this.pageSlideFacade.create(this.dataForm).then((res: any) => {
                this.slideList.unshift(res);
                this.submitted = false;
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }
}
