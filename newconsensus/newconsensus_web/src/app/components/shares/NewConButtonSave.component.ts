import { Component, Input } from '@angular/core';


@Component({
  selector: 'newcon-button-save',
  templateUrl: './NewConButtonSave.component.html'
})
export class NewConButtonSave {

    @Input()
    protected text: string = "ข้อความ";
    @Input()
    protected color: string = "#ffffff";
    @Input()
    protected bgColor: string = "#279d90";
    @Input()
    protected isRadius: boolean = true;
    @Input()
    protected isLoading: boolean = false;
    @Input()
    protected class: string | [string];

  constructor() {    

  }
  
}
