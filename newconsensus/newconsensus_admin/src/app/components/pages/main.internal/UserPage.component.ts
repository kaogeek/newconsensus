/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { Config } from '../../../models/Config';
import { PageUserFacade } from '../../../services/facade/PageUserFacade.service';
import { AbstractPage } from '../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogWarningComponent } from '../../shares/DialogWarningComponent.component';
import { AuthenManager } from '../../../services/AuthenManager.service';
import { Router } from '@angular/router';

const PAGE_NAME: string = "user";

@Component({
    selector: 'admin-user-page',
    templateUrl: './UserPage.component.html'
})
export class UserPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private pageUserFacade: PageUserFacade;
    private authenManager: AuthenManager;
    private router: Router;

    public dataForm: Config;
    public fieldSearch: string[];

    constructor(pageUserFacade: PageUserFacade, router: Router, dialog: MatDialog, authenManager: AuthenManager) {
        super(PAGE_NAME, dialog);
        this.pageUserFacade = pageUserFacade;
        this.router = router;
        this.authenManager = authenManager;
        this.fieldSearch = [
            "username",
            "email",
            "first_name",
            "last_name",
            "delete_flag"
        ]
        this.fieldTable = [
            {
                name: "username",
                label: "ชื่อผู้ใช้งาน",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "email",
                label: "อีเมล",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "firstName",
                label: "ชื่อ",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "lastName",
                label: "นามสกุล",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: false,
                align: "left"
            },
        ];
        this.actions = {
            isOfficial: true,
            isBan: true,
            isApprove: false,
            isCreate: false,
            isEdit: false,
            isDelete: false,
            isComment: false,
            isBack: false
        };
    }

    public ngOnInit() {
    }

    public clickOfficial(data: any): void {
        let cloneData = JSON.parse(JSON.stringify(data));
        if (cloneData.isOfficial === 1) {
            this.pageUserFacade.unofficial(cloneData.id).then((res) => {
                let index = 0;
                cloneData.isOfficial = 0;
                let dataTable = this.table.data;
                for (let d of dataTable) {
                    if (d.id == cloneData.id) {
                        dataTable[index] = cloneData;
                        this.table.setTableConfig(dataTable);
                        break;
                    }
                    index++;
                }
            }).catch((err) => {
                this.dialogWarning(err.error.message);
            });
        } else {
            this.pageUserFacade.official(cloneData.id).then((res) => {
                let index = 0;
                cloneData.isOfficial = 1;
                let dataTable = this.table.data;
                for (let d of dataTable) {
                    if (d.id == cloneData.id) {
                        dataTable[index] = cloneData;
                        this.table.setTableConfig(dataTable);
                        break;
                    }
                    index++;
                }
            }).catch((err) => {
                this.dialogWarning(err.error.message);
            });
        }
    }

    public clickBan(data: any): void {
        let cloneData = JSON.parse(JSON.stringify(data));
        if (cloneData.deleteFlag === 1) {
            this.pageUserFacade.unban(cloneData.id).then((res) => {
                let index = 0;
                cloneData.deleteFlag = 0;
                let dataTable = this.table.data;
                for (let d of dataTable) {
                    if (d.id == cloneData.id) {
                        dataTable[index] = cloneData;
                        this.table.setTableConfig(dataTable);
                        break;
                    }
                    index++;
                }
            }).catch((err) => {
                this.dialogWarning(err.error.message);
            });
        } else {
            this.pageUserFacade.ban(cloneData.id).then((res) => {
                let index = 0;
                cloneData.deleteFlag = 1;
                let dataTable = this.table.data;
                for (let d of dataTable) {
                    if (d.id == cloneData.id) {
                        dataTable[index] = cloneData;
                        this.table.setTableConfig(dataTable);
                        break;
                    }
                    index++;
                }
            }).catch((err) => {
                this.dialogWarning(err.error.message);
            });
        }
    }
}
