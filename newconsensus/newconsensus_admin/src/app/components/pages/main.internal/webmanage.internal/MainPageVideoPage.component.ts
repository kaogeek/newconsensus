import { Component, OnInit } from '@angular/core';
import { SearchFilter } from '../../../../models/SearchFilter';
import { MainPageVideoFacade } from '../../../../services/facade/MainPageVideoFacade.service';
import { PageVideo } from '../../../../models/PageVideo';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';

const PAGE_NAME: string = "pagevideo";

@Component({
    selector: 'admin-pagevideo-page',
    templateUrl: './MainPageVideoPage.component.html'
})
export class MainPageVideoPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private pageVideoFacade: MainPageVideoFacade;

    public dataForm: PageVideo;

    constructor(pageVideoFacade: MainPageVideoFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.pageVideoFacade = pageVideoFacade;
        this.fieldTable = [
            {
                name: "url",
                label: "ลิงค์",
                width: "300pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],  
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "tagline",
                label: "คำโปรย",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],  
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "ordering",
                label: "ลำดับ",
                width: "50pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],  
                formatDate: false,
                formatId: false,
                align: "right"
            }
        ]
        this.actions = { isOfficial: false, isBan: false,
            isApprove: false,isCreate: true,
            isEdit: true,
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
                name: "ลิงค์",
                field: "url",
                type: "text",
                placeholder: "http://example.com",
                required: true,
                disabled: false
            },
            {
                name: "คำโปรย",
                field: "tagline",
                type: "text",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "ลำดับ",
                field: "ordering",
                type: "integer",
                placeholder: "",
                required: false,
                disabled: false
            }
        ];
        this.dataForm = new PageVideo();
        this.dataForm.url = "";
        this.dataForm.tagline = "";
        this.dataForm.ordering = undefined;
    }

    public clickCreateForm(): void {
        this.drawer.toggle();
        this.setFields();
    }

    public clickEditForm(data: any): void {
        this.drawer.toggle();
        this.dataForm = JSON.parse(JSON.stringify(data));
    }

    public clickDelete(data: any): void {
        this.pageVideoFacade.delete(data.id).then((res) => {
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

    public clickSave(): void {
        this.dataForm.ordering = this.dataForm.ordering <= 0 ? undefined : this.dataForm.ordering;
        if (this.dataForm.id !== undefined && this.dataForm.id !== null) {
            this.pageVideoFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
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
            this.pageVideoFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }
}
