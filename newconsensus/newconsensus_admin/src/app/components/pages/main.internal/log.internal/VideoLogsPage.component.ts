/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit } from '@angular/core';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { MainPageVideoFacade } from '../../../../services/facade/MainPageVideoFacade.service';

const PAGE_NAME: string = "video_logs";

@Component({
    selector: 'admin-video-logs-page',
    templateUrl: './VideoLogsPage.component.html'
})
export class VideoLogsPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private videoFacade: MainPageVideoFacade;

    constructor(videoFacade: MainPageVideoFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.videoFacade = videoFacade;
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
