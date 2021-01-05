import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { PartnerFacade } from '../../../../services/facade/PartnerFacade.service';
import { Partner } from '../../../../models/Partner';
import { AbstractPage } from '../../AbstractPage.component';

const PAGE_NAME: string = "partner";

@Component({
    selector: 'admin-partner-page',
    templateUrl: './PartnerPage.component.html'
})
export class PartnerPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private partnerFacade: PartnerFacade;

    @ViewChild("drawerComment")
    public drawerComment: MatDrawer;
    public dataForm: Partner;

    constructor(partnerFacade: PartnerFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.partnerFacade = partnerFacade;
        this.fieldTable = [
            {
                name: "logoUrl",
                label: "รูปโลโก้",
                width: "50pt",
                class: "", formatColor: false, formatImage: true,  
                link: [],  
                formatDate: false,
                formatId: false,
                align: "left"
            },
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
                name: "link",
                label: "ลิงค์",
                width: "400pt",
                class: "", formatColor: false, formatImage: false,  
                link: [
                    {
                        link: "link",
                        isField: true
                    }
                ],  
                formatDate: false,
                formatId: false,
                align: "left"
            }
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
                name: "ลิงค์",
                field: "link",
                type: "textarea",
                placeholder: "http://example.com",
                required: true,
                disabled: false
            },
            {
                name: "รูปโลโก้",
                field: "logoUrl",
                type: "textarea",
                placeholder: "http://example.com",
                required: true,
                disabled: false
            }
        ];
        this.dataForm = new Partner();
        this.dataForm.name = "";
        this.dataForm.name = "";
        this.dataForm.link = "";
        this.dataForm.logoUrl = "";
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
            this.partnerFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
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
            this.partnerFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.partnerFacade.delete(data.id).then((res) => {
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
