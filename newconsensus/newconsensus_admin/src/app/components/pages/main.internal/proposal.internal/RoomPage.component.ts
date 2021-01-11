/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { RoomFacade } from '../../../../services/facade/RoomFacade.service';
import { SearchFilter } from '../../../../models/SearchFilter';
import { Room } from '../../../../models/Room';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';

const PAGE_NAME: string = "room";

@Component({
    selector: 'admin-room-page',
    templateUrl: './RoomPage.component.html'
})
export class RoomPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private roomFacade: RoomFacade;

    public dataForm: Room;

    constructor(roomFacade: RoomFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.roomFacade = roomFacade;
        let color = {

        }
        this.fieldTable = [
            {
                name: "color",
                label: "สี",
                width: "25pt",
                class: "",
                formatColor: true, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "center"
            },
            {
                name: "name",
                label: "ชื่อ",
                width: "200pt",
                class: "",
                formatColor: false, formatImage: false,
                link: [
                    {
                        link: "https://newconsen.io:4200/main/room/",
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
                        link: "name",
                        isField: true
                    },
                    {
                        link: "/proposal",
                        isField: false
                    }
                ],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "description",
                label: "รายละเอียด",
                width: "250pt",
                class: "",
                formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            }
        ]
        this.actions = { isOfficial: false, isBan: false,
            isApprove: false, isCreate: true,
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
            },
            {
                name: "สี",
                field: "color",
                type: "color",
                placeholder: "",
                required: false,
                disabled: false
            }
        ];
        this.dataForm = new Room();
        this.dataForm.name = "";
        this.dataForm.description = "";
        this.dataForm.color = "#FF8A65";
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
            this.roomFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
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
            this.roomFacade.create(this.dataForm).then((res: any) => {
                this.table.data.push(res);
                this.table.setTableConfig(this.table.data);
                this.drawer.toggle();
            }).catch((err: any) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickDelete(data: any): void {
        this.roomFacade.delete(data.id).then((res) => {
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
