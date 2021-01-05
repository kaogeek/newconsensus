import { Component, OnInit } from '@angular/core';
import { PageContentFacade } from '../../../../services/facade/PageContentFacade.service';
import { Content } from '../../../../models/Content';
import { AbstractPage } from '../../AbstractPage.component';
import { FieldRadio } from '../../../shares/FormComponent.component';
import { MatDialog } from '@angular/material/dialog';
import { VideoForm } from '../../../shares/VideoView.component';

const PAGE_NAME: string = "content";

@Component({
    selector: 'admin-content-page',
    templateUrl: './PageContentPage.component.html'
})
export class PageContentPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private contentFacade: PageContentFacade;

    public fieldRadios: FieldRadio[];
    public dataForm: Content;
    public videoForm: VideoForm;

    constructor(contentFacade: PageContentFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.contentFacade = contentFacade;
        this.videoForm = {
            width: "",
            height: "47vw",
            class: "newcon-content-page-layout-video",
        }
        this.fieldTable = [
            {
                name: "title",
                label: "ชื่อ",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [
                    {
                        link: "https://newconsen.io:4200/main/content/postpage/",
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
                label: "เนื้อหา",
                width: "250pt",
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
                name: "link",
                label: "ลิงค์ภายนอก",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "metaTagTitle",
                label: "Meta Tag Title",
                width: "50pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "metaTagContent",
                label: "Meta Tag Content",
                width: "100pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "metaTagKeyword",
                label: "Meta Tag Keyword",
                width: "50pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "isDraft",
                label: "แบบร่าง",
                width: "",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "center"
            },
            {
                name: "coverImage",
                label: "รูปภาพ",
                width: "150pt",
                class: "", formatColor: false, formatImage: true,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "videoUrl",
                label: "ลิงค์วิดีโอ",
                width: "150pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "imageUrl",
                label: "ลิงค์รูปภาพ",
                width: "150pt",
                class: "", formatColor: false, formatImage: true,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
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
                fieldSelect: "videoUrl",
                field: [
                    {
                        name: "ลิงค์วิดีโอ",
                        field: "videoUrl",
                        type: "text",
                        placeholder: "http://example.com",
                        required: false,
                        disabled: false
                    },
                    {
                        name: "ลิงค์รูปภาพ",
                        field: "imageUrl",
                        type: "text",
                        placeholder: "http://example.com",
                        required: false,
                        disabled: false
                    }
                ]
            }
        ]
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
                placeholder: "ใส่เนื้อหา Content",
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
                name: "รูปภาพหน้าปก",
                field: "coverImage",
                type: "text",
                placeholder: "http://example.com",
                required: true,
                disabled: false
            },
            {
                name: "แท็ก",
                field: "tagId",
                type: "autocompSelector",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "ลิงค์ภายนอก",
                field: "link",
                type: "text",
                placeholder: "http://example.com",
                required: false,
                disabled: false
            },
            {
                name: "metaTagTitle",
                field: "metaTagTitle",
                type: "text",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "metaTagContent",
                field: "metaTagContent",
                type: "textarea",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "metaTagKeyword",
                field: "metaTagKeyword",
                type: "text",
                placeholder: "",
                required: false,
                disabled: false
            },
            {
                name: "แบบร่าง",
                field: "isDraft",
                type: "boolean",
                placeholder: "",
                required: false,
                disabled: false
            },
        ];
        this.dataForm = new Content();
        this.dataForm.title = "";
        this.dataForm.content = "";
        this.dataForm.description = "";
        this.dataForm.metaTagTitle = "";
        this.dataForm.metaTagContent = "";
        this.dataForm.metaTagKeyword = "";
        this.dataForm.isDraft = false;
        this.dataForm.coverImage = "";
        this.dataForm.videoUrl = "";
        this.dataForm.tagId = [];
        this.dataForm.imageUrl = "";
        this.dataForm.link = "";
    }

    public clickCreateForm(): void {
        this.drawer.toggle();
        this.setFields();
    }

    public clickEditForm(data: any): void {
        this.drawer.toggle();
        let tagIds = [];
        let cloneData = JSON.parse(JSON.stringify(data));
        for (const tag of cloneData.tagId) {
            if (tag.tagId) {
                tagIds.push(tag.tagId);
            }
        }
        cloneData.tagId = tagIds;
        this.dataForm = cloneData;
        if (this.dataForm.videoUrl) {
            this.fieldRadios[0].fieldSelect = "videoUrl";
        } else if (this.dataForm.imageUrl) {
            this.fieldRadios[0].fieldSelect = "imageUrl";
        }
    }

    public clickSave(): void {
        for (let fieldRadio of this.fieldRadios) {
            for (let field of fieldRadio.field) {
                if (field.field !== fieldRadio.fieldSelect) {
                    this.dataForm[field.field] = null;
                }
            }
        }
        let dataForm: any = JSON.parse(JSON.stringify(this.dataForm));
        let tagIds = [];
        for (let tag of this.dataForm.tagId) {
            if ((tag as any).id) {
                tagIds.push((tag as any).id)
            }
        }
        dataForm.tagId = JSON.stringify(tagIds);
        if (dataForm.id !== undefined && dataForm.id !== null) {
            this.contentFacade.edit(dataForm.id, dataForm).then((res: any) => {
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
            this.contentFacade.create(dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.contentFacade.delete(data.id).then((res) => {
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
