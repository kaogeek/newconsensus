import { Component, OnInit } from '@angular/core';
import { SearchFilter } from '../../../../models/SearchFilter';
import { Tag } from '../../../../models/Tag';
import { TagFacade } from '../../../../services/facade/TagFacade.service';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';

const PAGE_NAME: string = "tag";

@Component({
    selector: 'admin-tag-page',
    templateUrl: './TagPage.component.html'
})
export class TagPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private tagFacade: TagFacade;

    public dataForm: Tag;

    constructor(tagFacade: TagFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.tagFacade = tagFacade;
        this.fieldTable = [
            {
                name: "name",
                label: "ชื่อ",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "description",
                label: "รายละเอียด",
                width: "300pt",
                class: "", formatColor: false, formatImage: false,  
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
        ]
        this.actions = { isOfficial: false, isBan: false,
            isApprove: false,
            isCreate: true,
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
                name: "ชื่อ",
                field: "name",
                type: "text",
                placeholder: "",
                required: true,
                disabled: false
            },
            {
                name: "รายละเอียด",
                field: "description",
                type: "textarea",
                placeholder: "",
                required: false,
                disabled: false
            }
        ];
        this.dataForm = new Tag();
        this.dataForm.name = "";
        this.dataForm.description = "";
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
        if (this.dataForm.id !== undefined && this.dataForm.id !== null) {
            this.tagFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
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
            this.tagFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.tagFacade.delete(data.id).then((res) => {
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
}
