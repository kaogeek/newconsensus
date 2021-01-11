/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { ActivityNewsFacade } from '../../../../services/facade/ActivityNewsFacade.service';
import { Activity } from '../../../../models/Activity';
import { AbstractPage } from '../../AbstractPage.component';
import { FieldRadio } from '../../../shares/FormComponent.component';
import { MatDialog } from '@angular/material/dialog';
import { VideoForm } from '../../../shares/VideoView.component';

const PAGE_NAME: string = "activity";

@Component({
    selector: 'admin-activity-page',
    templateUrl: './ActivityNewsPage.component.html'
})
export class ActivityNewsPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private activityNewsFacade: ActivityNewsFacade;

    public fieldRadios: FieldRadio[];
    public dataForm: Activity;
    public videoForm: VideoForm;

    constructor(activityNewsFacade: ActivityNewsFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.activityNewsFacade = activityNewsFacade;
        this.videoForm = {
            width: "",
            height: "47vw",
            class: "wrapper-image-video",
        }
        this.fieldTable = [
            {
                name: "title",
                label: "ชื่อ",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [
                    {
                        link: "https://newconsen.io:4200/main/content/activities/",
                        isField: false
                    },
                    {
                        link: "id",
                        isField: true
                    }
                ],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "content",
                label: "เนื้อหา",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "description",
                label: "คำอธิบาย",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "coverImageUrl",
                label: "ลิงค์รูปภาพ",
                width: "150pt",
                class: "", formatColor: false, formatImage: true,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "coverVideoUrl",
                label: "ลิงค์วิดีโอ",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "startDateTime",
                label: "วันที่เริ่ม",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: true,
                formatId: false,
                align: "left"
            },
            {
                name: "endDateTime",
                label: "วันที่สิ้นสุด",
                width: "70pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: true,
                formatId: false,
                align: "left"
            },
            {
                name: "latitude",
                label: "ละติจูด",
                width: "100pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "longitude",
                label: "ลองจิจูด",
                width: "100pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "right"
            },
            {
                name: "placeName",
                label: "ชื่อสถานที่",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            }
        ]
        this.actions = {
            isOfficial: false,
            isBan: false,
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
        this.fieldRadios = [
            {
                name: "เลือกเนื้อหา",
                fieldSelect: "coverImageUrl",
                field: [
                    {
                        name: "ลิงค์รูปภาพ",
                        field: "coverImageUrl",
                        type: "text",
                        placeholder: "http://example.com",
                        required: true,
                        disabled: false
                    },
                    {
                        name: "ลิงค์วิดีโอ",
                        field: "coverVideoUrl",
                        type: "text",
                        placeholder: "http://example.com",
                        required: true,
                        disabled: false
                    }
                ]
            }
        ];
        this.fields = [
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
                name: "คำอธิบาย",
                field: "description",
                type: "textarea",
                placeholder: "ใส่คำอธิบาย",
                required: true,
                disabled: false
            },
            {
                name: "ละติจูด",
                field: "latitude",
                type: "float",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "ลองจิจูด",
                field: "longitude",
                type: "float",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "ชื่อสถานที่",
                field: "placeName",
                type: "text",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "วันที่เริ่ม",
                field: "startDateTime",
                type: "date",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "วันที่สิ้นสุด",
                field: "endDateTime",
                type: "date",
                placeholder: "",
                required: false,
                disabled: false
            }
        ];
        this.dataForm = new Activity();
        this.dataForm.title = "";
        this.dataForm.coverImageUrl = "";
        this.dataForm.coverVideoUrl = "";
        this.dataForm.startDateTime = undefined;
        this.dataForm.endDateTime = undefined;
        this.dataForm.latitude = undefined;
        this.dataForm.longitude = undefined;
        this.dataForm.placeName = "";
        this.dataForm.content = "";
        this.dataForm.description = "";
    }

    public clickCreateForm(): void {
        this.drawer.toggle();
        this.setFields();
    }

    public clickEditForm(data: any): void {
        this.drawer.toggle();
        this.dataForm = JSON.parse(JSON.stringify(data));
        if (this.dataForm.coverImageUrl) {
            this.fieldRadios[0].fieldSelect = "coverImageUrl";
        } else if (this.dataForm.coverVideoUrl) {
            this.fieldRadios[0].fieldSelect = "coverVideoUrl";
        }
    }

    public clickDelete(data: any): void {
        this.activityNewsFacade.delete(data.id).then((res) => {
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
        for (let fieldRadio of this.fieldRadios) {
            for (let field of fieldRadio.field) {
                if (field.field !== fieldRadio.fieldSelect) {
                    this.dataForm[field.field] = null;
                }
            }
        }
        if (this.dataForm.id !== undefined && this.dataForm.id !== null) {
            this.activityNewsFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
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
            this.activityNewsFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }
}
