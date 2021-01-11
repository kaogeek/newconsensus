/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from './DialogDeleteComponent.component';
import { DialogWarningComponent } from './DialogWarningComponent.component';
import { SearchFilter } from '../../models/SearchFilter';
import { FormControl } from '@angular/forms';

const DEFAULT_DATE_TIME_FORMAT: string = "dd-MM-yyyy HH:mm:ss";
const ITEMS_PER_PAGE: string = 'รายการต่อหน้า';
const BASE_MODEL: string[] = [
    'createdDate',
    'createdByUsername',
    'modifiedDate',
    'modifiedByUsername',
    'action'
];
const LOGS_BASE_MODEL: string[] = [
    'userId',
    'action',
    'date',
    'detail'
];

interface LinkTable {
    link: string;
    isField: boolean;
}

export interface FieldTable {
    name: string;
    label: string;
    width: string;
    align: "center" | "left" | "right";
    class: string | string[];
    formatId: boolean;
    formatDate: boolean;
    formatColor: boolean;
    formatImage: boolean;
    link: LinkTable[];
}

export interface ActionTable {
    isOfficial: boolean;
    isBan: boolean;
    isApprove: boolean;
    isCreate: boolean;
    isEdit: boolean;
    isDelete: boolean;
    isComment: boolean;
    isBack: boolean;
}

@Component({
    selector: 'admin-table-component',
    templateUrl: './TableComponent.component.html'
})
export class TableComponent implements OnInit {

    private dialog: MatDialog;

    public isCommentbox: boolean;

    @Input()
    public facade: any;
    @Input()
    public isLogs: boolean;
    @Input()
    public title: string;
    @Input()
    public relation: string[];
    @Input()
    public fieldTable: FieldTable[];
    @Input()
    public actions: ActionTable;
    @Input()
    public fieldSearch: string[];
    @Input()
    public commentUnapprove: any;
    @Output() official: EventEmitter<any> = new EventEmitter();
    @Output() ban: EventEmitter<any> = new EventEmitter();
    @Output() approve: EventEmitter<any> = new EventEmitter();
    @Output() create: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() comment: EventEmitter<any> = new EventEmitter();
    @Output() back: EventEmitter<any> = new EventEmitter();

    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    @ViewChild(MatSort)
    public sort: MatSort;
    public search: string;
    public defaultDateTimeFormat: string = DEFAULT_DATE_TIME_FORMAT;
    public displayedColumns: string[];
    public isLoading: boolean;
    public dataSource: MatTableDataSource<any>;
    public filters = new FormControl();
    public data: any;
    public parentId: string;
    public widthAction: string;

    constructor(dialog: MatDialog) {
        this.dialog = dialog;
        this.search = "";
        this.fieldSearch = []
        this.data = [];
        if (this.commentUnapprove != null || this.commentUnapprove != undefined) {
            this.isCommentbox = true
            if (this.commentUnapprove > 99) {
                this.commentUnapprove = 99
            }
        } else {
            this.isCommentbox = false
        }
    }

    public ngOnInit() {
        this.displayedColumns = []
        for (let field of this.fieldTable) {
            this.displayedColumns.push(field.name);
            if (this.fieldSearch.length === 0 && (field.name === "title" || field.name === "name")) {
                this.fieldSearch.push(field.name);
            }
        }
        if (this.fieldSearch.length === 0) {
            if (!this.isLogs) {
                this.fieldSearch.push("created_by_username");
            } else {
                this.fieldSearch.push("userId");
                this.fieldSearch.push("action");
                this.fieldSearch.push("date");
                this.fieldSearch.push("detail");
            }
        }
        if (!this.isLogs) {
            this.displayedColumns.push.apply(this.displayedColumns, BASE_MODEL);
        } else {
            this.displayedColumns.push.apply(this.displayedColumns, LOGS_BASE_MODEL);
        }
        this.filters.setValue(this.fieldSearch);
        this.setTableConfig(this.data);
        if (!this.actions.isBack) {
            this.searchData();
        }
        this.widthAction = this.getWidthAction();
        this.sort.sortChange.subscribe(() =>
            this.searchData(false, true)
        );
        this.paginator.page.subscribe(() =>
            this.nextPage()
        )
    }

    public nextPage(): void {
        if (!this.paginator.hasNextPage()) {
            this.searchData(true);
        }
    }

    public searchData(isNextPage?: boolean, isSort?: boolean): void {
        this.isLoading = true;
        let search: SearchFilter = new SearchFilter();
        let where = "";
        if (this.search.trim() !== "") {
            for (let field of this.filters.value) {
                if (field) {
                    if (where === "") {
                        where += field + " like '%" + this.search + "%'";
                    } else {
                        where += " or " + field + " like '%" + this.search + "%'";
                    }
                }
            }
        }
        search.orderBy = {};
        search.offset = isNextPage ? this.paginator.length : 0;
        search.whereConditions = where;
        search.relation = this.relation;
        search.count = false;
        let facade: any;
        if (this.isLogs) {
            if (isNextPage || isSort) {
                search.orderBy[this.sort.active] = this.sort.direction;
            } else {
                this.sort.active = "date";
                this.sort.direction = "desc";
                search.orderBy["date"] = "desc";
            }
            facade = this.facade.searchLog(search);
        } else {
            if (isNextPage || isSort) {
                search.orderBy[this.sort.active] = this.sort.direction;
            } else {
                this.sort.active = "createdDate";
                this.sort.direction = "desc";
                search.orderBy["createdDate"] = "desc";
            }
            if (this.parentId) {
                facade = this.facade.search(this.parentId, search);
            } else {
                facade = this.facade.search(search);
            }
        }
        facade.then((res: any) => {
            if (isNextPage) {
                for (let r of res) {
                    this.data.push(r);
                }
            } else {
                this.paginator.pageIndex = 0;
                this.data = res ? res : [];
            }
            this.setTableConfig(this.data);
            this.isLoading = false;
        }).catch((err: any) => {
            if (!this.parentId) {
                this.dialogWarning(err.error.message);
            }
            this.setTableConfig([]);
            this.isLoading = false;
            // this.dialogWarning(err.error.message);
        });
    }

    public setTableConfig(data: any): void {
        // fix bug TypeError: data.slice is not a function
        if (!Array.isArray(data)) {
            return;
        }
        this.data = data;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.paginator._intl.itemsPerPageLabel = ITEMS_PER_PAGE;
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 ของ ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} ของ ${length}`; };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public getWidthAction(): string {
        let ationWidth: number = 75;
        let count: number = 0;
        for (let action in this.actions) {
            if (action !== "isBack" && action !== "isCreate" && this.actions[action]) {
                count++;
            }
        }
        return (ationWidth * count) + "px";
    }

    public clearSerach() {
        this.search = "";
        this.dataSource.filter = "";

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public clickApprove(data: any): void {
        this.approve.emit(data);
    }

    public clickOfficial(data: any): void {
        this.official.emit(data);
    }

    public clickBan(data: any): void {
        this.ban.emit(data);
    }

    public clickCreateForm(): void {
        this.create.emit(null);
    }

    public clickEditForm(data: any): void {
        this.edit.emit(data);
    }

    public clickDelete(data: any): void {
        let dialogRef;
        if (data.name || data.title) {
            dialogRef = this.dialog.open(DialogDeleteComponent, {
                data: data
            });
        } else {
            dialogRef = this.dialog.open(DialogWarningComponent, {
                data: {
                    title: "คุณต้องการที่จะลบข้อมูลนี้ ?"
                }
            });
        }
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete.emit(data);
            }
        });
    }

    public clickComment(data: any): void {
        this.comment.emit(data);
    }

    public clickBack(): void {
        this.back.emit(null);
    }
    public dialogWarning(message: string): void {
        this.dialog.open(DialogWarningComponent, {
            data: {
                title: message,
                error: true
            }
        });
    }
}
