import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFilter } from '../../../../models/SearchFilter';
import { MatDrawer, MatDialog } from '@angular/material';
import { ProposalFacade } from '../../../../services/facade/ProposalFacade.service';
import { Proposal } from '../../../../models/Proposal';
import { ProposalCommentPage } from './ProposalCommentPage.component';
import { AbstractPage } from '../../AbstractPage.component';
import { DialogWarningComponent } from '../../../shares/DialogWarningComponent.component';

const PAGE_NAME: string = "proposal";

@Component({
    selector: 'admin-proposal-page',
    templateUrl: './ProposalPage.component.html'
})
export class ProposalPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private proposalFacade: ProposalFacade;

    @ViewChild("drawerComment")
    public drawerComment: MatDrawer;
    @ViewChild("proposalComment")
    public proposalComment: ProposalCommentPage;
    public dataForm: Proposal;
    public dataPin: any;
    public dataPinOriginal: any;
    public submitted: boolean;

    constructor(proposalFacade: ProposalFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.proposalFacade = proposalFacade;
        this.fieldTable = [
            {
                name: "roomId",
                label: "รหัสห้อง",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: true,
                align: "center"
            },
            {
                name: "title",
                label: "ชื่อ",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [
                    {
                        link: "https://newconsen.io:4200/main/room/proposal/comment/post/",
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
                align: "center"
            },
            {
                name: "content",
                label: "เนื้อหา",
                width: "300pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "supporterCount",
                label: "จำนวนรับรอง",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "reqSupporter",
                label: "จำนวนที่ต้องการรับรอง",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "approveUsername",
                label: "ผู้ใช้ที่อนุมัติ",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "approveDate",
                label: "วันที่อนุมัติ",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: true,
                formatId: false,
                align: "left"
            },
            {
                name: "likeCount",
                label: "จำนวนไลค์",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "dislikeCount",
                label: "จำนวนดิสไลค์",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "endDate",
                label: "วันที่สิ้นสุด",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: true,
                formatId: false,
                align: "left"
            },
            {
                name: "debateTag",
                label: "แท็กการอภิปราย",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "center"
            },
        ]
        this.actions = { isOfficial: false,
            isBan: false,
            isApprove: true,
            isCreate: true,
            isEdit: false,
            isDelete: true,
            isComment: true,
            isBack: false
        };
        this.setFields();
    }

    public ngOnInit() {
        let search: SearchFilter = new SearchFilter();
        search.whereConditions = "pin_ordering >= 0";
        this.proposalFacade.search(search).then((res) => {
            res.sort(this.sortSearch);
            this.dataPin = [];
            for (let index = 1; index <= 5; index++) {
                this.dataPin.push({
                    proposalId: res.length >= index ? res[index - 1].id : undefined,
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

    private setFields(): void {
        this.fields = [
            {
                name: "รหัสห้อง",
                field: "roomId",
                type: "autocomp",
                placeholder: "",
                required: true,
                disabled: false
            },
            {
                name: "ชื่อ",
                field: "title",
                type: "text",
                placeholder: "",
                required: true,
                disabled: false
            },
            {
                name: "เนื้อหา",
                field: "content",
                type: "contentEditor",
                placeholder: "",
                required: true,
                disabled: false
            },
            {
                name: "จำนวนที่รับรอง",
                field: "reqSupporter",
                type: "integer",
                placeholder: "",
                required: true,
                disabled: true
            },
            {
                name: "แท็กการอภิปราย",
                field: "debateTag",
                type: "autocompSelector",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "วันที่สิ้นสุด",
                field: "endDate",
                type: "date",
                placeholder: "",
                required: false,
                disabled: false
            },
        ];
        this.dataForm = new Proposal();
        this.dataForm.roomId = undefined;
        this.dataForm.title = "";
        this.dataForm.content = "";
        this.dataForm.reqSupporter = 500;
        this.dataForm.endDate = undefined;
        this.dataForm.debateTag = [];
    }

    public getWhereConditions(): string {
        var where = "";
        for (let pin of this.dataPin) {
            if (pin.proposalId) {
                if (where !== "") {
                    where += " and id != " + pin.proposalId;
                } else {
                    where += "id != " + pin.proposalId;
                }
            }
        }
        return where;
    }

    public checkPin(index: number): boolean {
        if (index === 0 && this.dataPin[index].proposalId) {
            return true;
        } else {
            if (!this.dataPin[index - 1].proposalId && this.dataPin[index].proposalId) {
                return false;
            } else if (this.dataPin[index].proposalId) {
                return true;
            } else if (this.dataPin[index - 1].proposalId && !this.dataPin[index].proposalId) {
                return true;
            }
        }
        return true;
    }


    public clickPinProposal(): void {
        this.drawer.toggle();
        this.dataPinOriginal = JSON.parse(JSON.stringify(this.dataPin));
    }

    public clickSavePin(): void {
        this.submitted = true;
        let countPass = 0;
        if (this.dataPin) {
            for (let index = 0; index < this.dataPin.length; index++) {
                if (this.checkPin(index)) {
                    countPass++;
                } else {
                    countPass--;
                }
            }
        }
        if (countPass === this.dataPin.length) {
            let body = {
                data: this.dataPin
            }
            this.proposalFacade.pin(body, true).then((res) => {
                this.submitted = false;
                this.drawer.toggle();
            }).catch((err) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickCreateForm(): void {
        this.drawer.toggle();
        this.dataPin = JSON.parse(JSON.stringify(this.dataPinOriginal));
        this.setFields();
    }

    public clickEditForm(data: any): void {
        this.drawer.toggle();
        this.dataForm = JSON.parse(JSON.stringify(data));
    }

    public clickComment(data: any): void {
        this.drawerComment.toggle();
        this.proposalComment.table.parentId = data.id;
        this.proposalComment.table.setTableConfig(data);
        this.proposalComment.table.searchData();
    }

    public clickApprove(data: any): void {
        let dialogRef = this.dialog.open(DialogWarningComponent, {
            data: {
                title: data.approveUserId ? "คุณต้องการยกเลิกอนุมัติหรือไม่" : "คุณต้องการอนุมัติหรือไม่"
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (data.approveUserId) {
                    this.proposalFacade.unapprove(data.id).then((res: any) => {
                        let index = 0;
                        let data = this.table.data;
                        for (let d of data) {
                            if (d.id == res.id) {
                                data[index] = res;
                                break;
                            }
                            index++;
                        }
                        this.table.setTableConfig(data);
                    }).catch((err: any) => {
                        console.log(err);
                        this.dialogWarning(err.error.message);
                    });
                } else {
                    this.proposalFacade.approve(data.id).then((res: any) => {
                        let index = 0;
                        let data = this.table.data;
                        for (let d of data) {
                            if (d.id == res.id) {
                                data[index] = res;
                                break;
                            }
                            index++;
                        }
                        this.table.setTableConfig(data);
                    }).catch((err: any) => {
                        console.log(err);
                        this.dialogWarning(err.error.message);
                    });
                }
            }
        });
    }

    public clickSave(): void {
        this.dataForm.reqSupporter = this.dataForm.reqSupporter <= 0 ? undefined : this.dataForm.reqSupporter;
        if (this.dataForm.debateTag.length > 0) {
            let clone = JSON.parse(JSON.stringify(this.dataForm.debateTag));
            this.dataForm.debateTag = clone.map(obj => {
                return obj.id;
            });
            (this.dataForm.debateTag as any) = JSON.stringify(this.dataForm.debateTag);
        }
        if (this.dataForm.id !== undefined && this.dataForm.id !== null) {
            this.proposalFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
                let index = 0;
                let data = this.table.data;
                for (let d of data) {
                    if (d.id == res.id) {
                        data[index] = res;
                        break;
                    }
                    index++;
                }
                this.table.setTableConfig(data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        } else {
            this.proposalFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.proposalFacade.delete(data.id).then((res) => {
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

    public clickProposalCommentBack(): void {
        this.drawerComment.toggle();
    }
}
