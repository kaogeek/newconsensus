/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { MatPaginator } from '@angular/material';

@Component({
    selector: 'newcon-paginator-card',
    templateUrl: './PaginatorCard.component.html',
})
export class PaginatorCard implements OnInit {

    @ViewChild(MatPaginator, { static: false })
    public paginator: MatPaginator;
    public search: string; 
    @Input()
    public isLoading: boolean;
    @Input()
    public data: any;
    @Input()
    public pageSizeOptions: number[];
    @Input()
    public pageSize: number;
    @Input()
    public hidePageSize: boolean;
    @Input()
    private isProposalLink:boolean;
    @Input()
    private isDebateLink:boolean;
    @Input()
    private isEdit: Function;
    @Output()
    public loadMore: EventEmitter<any> = new EventEmitter();
    @Output()
    public clickEditCard: EventEmitter<any> = new EventEmitter();
    @Output()
    public clickDeleteCard: EventEmitter<any> = new EventEmitter();

    constructor() {
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this.paginator.page.subscribe(() =>
            this.nextPage()
        )
    }
    public nextPage(): void {
        if (!this.paginator.hasNextPage()) {
            this.loadMore.emit();
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

    public paginatorEditCard(data) {
        this.clickEditCard.emit(data);
    } 

    public isEditFunction(index: number): boolean {
        if(this.isEdit !== undefined && this.isEdit !== null){
            if(typeof this.isEdit === 'function') {
              return this.isEdit.call(this, this.data[index]);
            } else {
              return this.isEdit;
            }
        }
        return true;
    }

    public getLink(data: any): string {
      if(this.isProposalLink){
        return '/main/proposal/comment/post/'+data.id;
      }

      if(this.isDebateLink){
        return '/main/debate/comment/post/'+data.id;
      }
      return '/main/proposal/comment/post/'+data.id;

    }
}
