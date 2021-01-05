import { Component, OnInit } from '@angular/core';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginLogFacade } from '../../../../services/facade/LoginLogFacade.service';

const PAGE_NAME: string = "login_log";

@Component({
    selector: 'admin-login-log-page',
    templateUrl: './LoginLogPage.component.html'
})
export class LoginLogPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private loginLogFacade: LoginLogFacade;
    public fieldSearch: string[];

    constructor(loginLogFacade: LoginLogFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.loginLogFacade = loginLogFacade;
        this.fieldSearch = [
            "userId",
            "emailId",
            "firstName",
            "ipAddress",
            "createdDate"
        ];
        this.fieldTable = [
            {
                name: "id",
                label: "รหัส",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [], 
                formatDate: false,
                formatId: true,
                align: "center"
            },
            {
                name: "userId",
                label: "รหัสผู้ใช้",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [], 
                formatDate: false,
                formatId: true,
                align: "center"
            },
            {
                name: "emailId",
                label: "อีเมล",
                width: "300pt",
                class: "", formatColor: false, formatImage: false,
                link: [], 
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "firstName",
                label: "ชื่อ",
                width: "300pt",
                class: "", formatColor: false, formatImage: false,
                link: [], 
                formatDate: false,
                formatId: false,
                align: "left"
            },
            {
                name: "ipAddress",
                label: "IP Address",
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
            isCreate: false,
            isEdit: false,
            isDelete: false,
            isComment: false,
            isBack: false
        };
    }

    public ngOnInit() {
    }
}
