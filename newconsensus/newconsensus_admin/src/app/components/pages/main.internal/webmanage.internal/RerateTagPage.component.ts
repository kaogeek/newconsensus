/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { SearchFilter } from '../../../../models/SearchFilter';
import { RerateTag } from '../../../../models/RerateTag';
import { RerateTagFacade } from '../../../../services/facade/RerateTagFacade.service';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';

const PAGE_NAME: string = "reratetag";

@Component({
    selector: 'admin-rerate-tag-page',
    templateUrl: './RerateTagPage.component.html'
})
export class RerateTagPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private reratetagFacade: RerateTagFacade;

    public dataForm: RerateTag;

    constructor(reratetagFacade: RerateTagFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.reratetagFacade = reratetagFacade;
        this.fieldTable = [
            {
                name: "name",
                label: "ชื่อ",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],
                formatDate: false,
                formatId: false,
                align: "center"
            },
            {
                name: "trendingScore",
                label: "score",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],
                formatDate: false,
                formatId: false,
                align: "center"
            },
        ],
        this.actions = { isOfficial: false, isBan: false,
            isApprove: false,
            isCreate: true,
            isEdit: false,
            isDelete: true,
            isComment: false,             
            isBack: false
        };
        this.setFields();
    }

    public ngOnInit() {
    }

    private setFields(): void {
        this.fields = [
            {
                name: "ชื่อ",
                field: "name",
                type: "text",
                placeholder: "",
                required: true,
                disabled: false
            },
        ];
        this.dataForm = new RerateTag();
        this.dataForm.name = "";
    }

    public clickCreateForm(): void {
        this.drawer.toggle();
        this.setFields();
    }

    public clickEditForm(data: any): void {
        this.drawer.toggle();
        this.dataForm = JSON.parse(JSON.stringify(data));
    }

    public clickSave(): void {
        if (this.dataForm.name !== undefined && this.dataForm.name !== null) {
            this.reratetagFacade.edit(this.dataForm.name, this.dataForm).then((res: any) => {
                let index = 0;
                let data = this.table.data;
                for (let d of data) {
                    if (d.name == res.name) {
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
            this.reratetagFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.reratetagFacade.delete(data.name).then((res) => {
            let index = 0;
            let dataTable = this.table.data;
            for (let d of dataTable) {
                if (d.name == data.name) {
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
}
