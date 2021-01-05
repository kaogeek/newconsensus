import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'supporter-bar',
  templateUrl: './SupporterBar.component.html'
})
export class SupporterBar implements OnInit {
 
  @Input()
  protected supported: number = 0;
  @Input()
  protected max: number = 500;
  @Input()
  protected color: string = "#ffffff";
  @Input()
  protected class: string | [string];

  constructor() {
  }

  ngOnInit() {

  }

  public getValue(): number {
    return (this.supported / this.max) * 100;
  }
}
