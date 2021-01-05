import { Component, OnInit, Input } from '@angular/core';
import { VoteCommentFacade } from '../../../../services/facade/VoteCommentFacade.service';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogWarningComponent } from '../../../shares/DialogWarningComponent.component';

@Component({
    selector: 'admin-votecomment-page',
    templateUrl: './VoteCommentPage.component.html'
})
export class VoteCommentPage extends AbstractPage implements OnInit {

    private voteCommentFacade: VoteCommentFacade;

    constructor(voteCommentFacade: VoteCommentFacade, dialog: MatDialog) {
        super("Vote Comment", dialog);
        this.voteCommentFacade = voteCommentFacade;
        this.fieldTable = [
            {
                name: "comment",
                label: "ความคิดเห็น",
                width: "350pt",
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
        this.actions = { isOfficial: false, isBan: false,
            isApprove: true,
            isCreate: false,
            isEdit: false,
            isDelete: true,
            isComment: false,             
            isBack: true
        };
    }

    public ngOnInit() {
    }

    public clickDelete(data: any): void {
        this.voteCommentFacade.delete(this.table.parentId, data.id).then((res) => {
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

    public clickApprove(data: any): void {
        let dialogRef = this.dialog.open(DialogWarningComponent, {
            data: {
                title: data.approveUserId ? "คุณต้องการยกเลิกอนุมัติหรือไม่" : "คุณต้องการอนุมัติหรือไม่"
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (data.approveUserId) {
                    this.voteCommentFacade.unapprove(data.voteId,data.id).then((res: any) => {
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
                    this.voteCommentFacade.approve(data.voteId,data.id).then((res: any) => {
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

}
