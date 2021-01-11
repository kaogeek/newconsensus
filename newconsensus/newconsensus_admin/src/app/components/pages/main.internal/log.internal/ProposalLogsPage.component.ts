/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { ProposalFacade } from '../../../../services/facade/ProposalFacade.service';

const PAGE_NAME: string = "proposal_logs";

@Component({
    selector: 'admin-proposal-logs-page',
    templateUrl: './ProposalLogsPage.component.html'
})
export class ProposalLogsPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private proposlFacade: ProposalFacade;
    public fieldSearch: string[];

    constructor(proposlFacade: ProposalFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.proposlFacade = proposlFacade;
        this.fieldSearch = [
            "userId",
            "proposalId",
            "action",
            "date",
            "detail",
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
                name: "proposalId",
                label: "รหัสกระทู้รับรอง",
                width: "200pt",
                class: "", formatColor: false, formatImage: false,
                link: [],
                formatDate: false,
                formatId: true,
                align: "center"
            }
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
