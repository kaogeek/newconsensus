/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, Input, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchFilter } from '../../models/SearchFilter';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlert } from './dialog/dialog';
import { MESSAGE } from 'src/app/AlertMessage';
import { DialogWarningComponent } from './shares';

export interface autocomp {
  id: string;
  name: string;
  roomId: string;
}

@Component({
  selector: 'multiple-select-autocomp',
  templateUrl: './MultipleSelectAutoComp.component.html'
})
export class MultipleSelectAutoComp implements OnInit {

  private dialog: MatDialog;

  @ViewChild("inPut", { static: false })
  public inPut: ElementRef;
  @Input("facade")
  public facade: any;
  @Input("title")
  // public title: string;
  protected title: string = "แท็ก";
  @Input("field")
  public field: string;
  @Input("fieldSearch")
  public fieldSearch: string | string[];
  @Input("data")
  public data: any;
  public options: any;
  public isLoading: boolean;
  public selected: boolean;

  constructor(dialog: MatDialog) {
    this.dialog = dialog;
    this.options = [];
    this.isLoading = false;
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.data[this.field] = this.data[this.field] ? this.data[this.field] : [];
    if (this.data[this.field].length > 0) {
      let search: SearchFilter = new SearchFilter();
      search.whereConditions = "";
      search.count = false;
      let whereIn = "";
      for (let data of this.data[this.field]) {
        if (whereIn === "") {
          whereIn += "'" + data + "'";
        } else {
          whereIn += ", '" + data + "'";
        }
      }
      search.whereConditions = "id in (" + whereIn + ")";
      this.facade.search(search).then((res) => {
        this.data[this.field] = res;
      }).catch((err) => {
        this.dialogWarning(err.error.message);
      });
    } else {
      this.data[this.field] = [];
    }
  }

  public ngAfterViewInit(): void {
    fromEvent(this.inPut.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current   
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: string) => {
      this.isLoading = true;
      this.keyUpAutoComp(text);
    });
  }

  private stopIsloading(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private dialogWarning(message: string): void {
    this.dialog.open(DialogWarningComponent, {
      data: {
        title: message,
        error: true
      }
    });
  }

  private checkSelected(name: any): boolean {
    for (let d of this.data[this.field]) {
      if (d.name == name) {
        return true;
      }
    }
    return false;
  }

  private keyUpAutoComp(value: string): void {
    let isTitle: boolean = this.field === "roomId" || this.field === "tagId" ? false : true;
    let search: SearchFilter = new SearchFilter();
    let searchText = value.trim();
    search.limit = 5;
    search.whereConditions = "";
    search.count = false;
    if (searchText !== "") {
      // this.data[this.field] = [];
      search.whereConditions = isTitle ? "title like '%" + searchText + "%'" : "name like '%" + searchText + "%'";
      // for (let fieldSearch of  this.fieldSearch) {
      // if (search.whereConditions === "") {
      //   search.whereConditions =  fieldSearch+" like '%"+searchText+"%'";
      // } else {
      //   search.whereConditions =  "or "+fieldSearch+" like '%"+searchText+"%'";
      // }
      // }
    }
    this.facade.getTopScore(search).then((res: any) => {
      this.options = res.map(obj => {
        var rObj: any = obj;
        // rObj["selected"] = this.checkSelected(obj.id);
        rObj["selected"] = true;
        return rObj;
      });
      this.stopIsloading();

      for (let selected of this.options) {
        this.changeSelect(selected, false);
      }
    }).catch((err: any) => {
      // console.log(err);
      this.stopIsloading();
      this.dialogWarning(err.error.message);
    });
  }

  public changeSelect(value: any, del?: boolean): void {
    if (value.selected && !del) {
      let cunter = 0;
      for (let d of this.data[this.field]) {
        if (d.name == value.name) {
          cunter++;
        }
      }
      if (cunter === 0) {
        this.data[this.field].push(value);
      }
    } else {
      let index = 0;
      for (let d of this.data[this.field]) {
        if (d.name == value.name) {
          this.data[this.field].splice(index, 1);
          break;
        }
        index++;
      }
      if (del) {
        let index = 0;
        for (let o of this.options) {
          if (o.name == value.name) {
            this.options[index].selected = false;
            break;
          }
          index++;
        }
      }
    }
  }

  public clearAutoComp(): void {
    this.inPut.nativeElement.value = "";
    this.options = [];
  }
}
