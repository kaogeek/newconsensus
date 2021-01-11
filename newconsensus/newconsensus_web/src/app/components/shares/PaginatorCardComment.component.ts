/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { MatPaginator } from '@angular/material';

@Component({
    selector: 'newcon-paginator-card-comment',
    templateUrl: './PaginatorCardComment.component.html',
})
export class PaginatorCardComment implements OnInit {

    @Input()
    protected data: any;
    @Input()
    protected isLoading: boolean;
    @Input()
    protected image: any;
    @Input()
    protected pageSizeOptions: number[];
    @Input()
    protected pageSize: number;
    @Input()
    protected hidePageSize: boolean;
    @Input()
    protected typeLink: "debate" | "vote" | "proposal";
    @Input()
    protected link: string;
    @Output()
    protected loadMoreComment: EventEmitter<any> = new EventEmitter();
    @Output()
    protected clickEditCardComment: EventEmitter<any> = new EventEmitter();
    @Output()
    protected clickDeleteCardComment: EventEmitter<any> = new EventEmitter();

    @ViewChild(MatPaginator, { static: false })
    public paginator: MatPaginator;

    public search: string;

    constructor() {
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit() {
        this.paginator.page.subscribe(() =>
            this.nextPage()
        )
    }

    public nextPage(): void {
        if (!this.paginator.hasNextPage()) {
            this.loadMoreComment.emit();
        }
    }

    public isShow(index): boolean {
        let page = this.paginator.pageIndex;
        let itemStart = ((page + 1) * 5) - 5;
        let itemEnd = ((page + 1) * 5) - 1;
        if (itemStart <= index && itemEnd >= index) {
          return true;
        }
        return false
    }

    public getLink(data: any): string {
        if (this.link) {
            return this.link;
        } else {
            if (this.typeLink === 'debate') {
                return '/main/debate/comment/post/'+data.debateId
            } else if (this.typeLink === 'vote'){
                return '/main/vote/comment/'+data.voteId
            } else if (this.typeLink === 'proposal'){
                return  '/main/proposal/comment/post/'+data.proposalId
            }
        }
    }

}
