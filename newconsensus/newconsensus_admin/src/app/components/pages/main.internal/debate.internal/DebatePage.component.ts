/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { DebateCommentPage } from './DebateCommentPage.component';
import { AbstractPage } from '../../AbstractPage.component';
import { SearchFilter } from '../../../../models/SearchFilter';

const PAGE_NAME: string = "debate";

@Component({
    selector: 'admin-debate-page',
    templateUrl: './DebatePage.component.html'
})
export class DebatePage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private debateFacade: DebateFacade;

    @ViewChild("drawerComment")
    public drawerComment: MatDrawer;
    @ViewChild("debateComment")
    public debateComment: DebateCommentPage;
    public pinDebates: any;
    public pinDebatesOriginal: any;
    public submitted: boolean;

    constructor(debateFacade: DebateFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.debateFacade = debateFacade;
        this.fieldTable = [
            {
                name: "title",
                label: "ชื่อ",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [
                    {
                        link: "https://newconsen.io:4200/main/debate/comment/post/",
                        isField: false
                    },
                    {
                        link: "id",
                        isField: true
                    },
                    {
                        link: "-",
                        isField: false
                    },
                    {
                        link: "title",
                        isField: true
                    }
                ],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "content",
                label: "เนิ้อหา",
                width: "300pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "likeCount",
                label: "จำนวนไลค์",
                width: "100pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "dislikeCount",
                label: "จำนวนดิสไลค์",
                width: "100pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            }
        ]
        this.actions = { isOfficial: false,
            isBan: false,
            isApprove: false,
            isCreate: true,
            isEdit: false,
            isDelete: true,
            isComment: true,
            isBack: false
        };
    }

    public ngOnInit() {
        let search: SearchFilter = new SearchFilter();
        search.whereConditions = "pin_ordering >= 0";
        this.debateFacade.search(search).then((res) => {
            this.pinDebates = [];
            res.sort(this.sortSearch);
            for (let index = 1; index <= 5; index++) {
                this.pinDebates.push({
                    debateId: res.length >= index ? res[index - 1].id : undefined,
                    pinOrdering: index
                });
            }
        }).catch((err) => {
            console.log(err);

        });
    }

    private sortSearch(a, b) {
        if (a.pinOrdering > b.pinOrdering) return 1;
        if (b.pinOrdering > a.pinOrdering) return -1;

        return 0;
    }

    public getWhereConditions(): string {
        var where = "";
        for (let pin of this.pinDebates) {
            if (pin.debateId) {
                if (where !== "") {
                    where += " and id != " + pin.debateId;
                } else {
                    where += "id != " + pin.debateId;
                }
            }
        }
        return where;
    }

    public checkPin(index: number): boolean {
        if (index === 0 && this.pinDebates[index].debateId) {
            return true;
        } else {
            if (!this.pinDebates[index - 1].debateId && this.pinDebates[index].debateId) {
                return false;
            } else if (this.pinDebates[index].debateId) {
                return true;
            } else if (this.pinDebates[index - 1].debateId && !this.pinDebates[index].debateId) {
                return true;
            }
        }
        return true;
    }


    public clickPinDebate(): void {
        this.drawer.toggle();
        this.pinDebatesOriginal = JSON.parse(JSON.stringify(this.pinDebates));
    }

    public clickComment(data: any): void {
        this.drawerComment.toggle();
        this.debateComment.table.parentId = data.id;
        this.debateComment.table.setTableConfig(data);
        this.debateComment.table.searchData();
    }

    public clickCloseDrawer(): void {
        super.clickCloseDrawer();
        this.pinDebates = JSON.parse(JSON.stringify(this.pinDebatesOriginal));
        this.submitted = false;
    }

    public clickSave(): void {
        this.submitted = true;
        let countPass = 0;
        if (this.pinDebates) {
            for (let index = 0; index < this.pinDebates.length; index++) {
                if (this.checkPin(index)) {
                    countPass++;
                } else {
                    countPass--;
                }
            }
        }
        if (countPass === this.pinDebates.length) {
            let body = {
                data: this.pinDebates
            }
            this.debateFacade.pin(body, true).then((res) => {
                this.submitted = false;
                this.drawer.toggle();
            }).catch((err) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.debateFacade.delete(data.id).then((res) => {
            let index = 0;
            let dataTable = this.table.data;
            for (let d of dataTable) {
                if (d.id == data.id) {
                    dataTable.splice(index, 1);
                    this.table.setTableConfig(dataTable);
                    this.dialogWarning("ลบข้อมูลสำเร็จ");
                    break;
                }
                index++;
            }
        }).catch((err) => {
            this.dialogWarning(err.error.message);
        });
    }

    public clickDebateCommentBack(): void {
        this.drawerComment.toggle();
    }
}
