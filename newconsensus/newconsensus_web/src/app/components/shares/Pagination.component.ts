import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PaginationInstance } from 'ngx-pagination';

@Component({
    selector: 'newcon-pagination-comment',
    templateUrl: './Pagination.component.html',
})
export class Pagination implements OnInit {

    @Input() 
    protected itemsPerPage: number = 10;
    @Input() 
    protected currentPage: number = 1;

    public config: PaginationInstance = {
        id: 'server',
        itemsPerPage: 10,
        currentPage: 1
    };
    @Output()
    protected pageChange: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.config.currentPage = this.currentPage
        this.config.itemsPerPage = this.itemsPerPage
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit() {
    }

    public onPageChange(page: number): void {
        this.pageChange.emit(page);
    }
}
