import { Component, OnInit } from '@angular/core';
import { AbstractPage } from '../../AbstractPage.component';
import { MatDialog } from '@angular/material/dialog';
import { MainPageSlideFacade } from '../../../../services/facade/MainPageSlideFacade.service';

const PAGE_NAME: string = "slide_logs";

@Component({
    selector: 'admin-slide-logs-page',
    templateUrl: './SlideLogsPage.component.html'
})
export class SlideLogsPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    private slideFacade: MainPageSlideFacade;

    constructor(slideFacade: MainPageSlideFacade, dialog: MatDialog) {
        super(PAGE_NAME, dialog);
        this.slideFacade = slideFacade;
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
