import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'newcon-button-load-more',
  templateUrl: './NewConButtonLoadMore.component.html'
})
export class NewConButtonLoadMore {
 
    @Input()
    protected isLoadingMore: boolean = false;
    @Input()
    protected isShowLoadMore: boolean = true; 
    @Output()
    protected clickLoadMore: EventEmitter<any> = new EventEmitter();

  constructor() {    

  }

  public onClickLoadMore(): void {
    this.clickLoadMore.emit();
  }
  
}
