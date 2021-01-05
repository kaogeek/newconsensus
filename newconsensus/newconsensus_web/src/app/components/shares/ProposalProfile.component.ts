import { Component, Input } from '@angular/core';


@Component({
  selector: 'proposal-profile',
  templateUrl: './ProposalProfile.component.html'
})
export class ProposalProfile {

  @Input()
  protected width: string = "740pt";
  @Input()
  protected height: string = "100pt";
  @Input()
  protected class: string | [string];
  @Input()
  protected bgColor: string = "#ffffff";
  @Input()
  protected proposal: string = "topic topic topic topic topic topic";
  @Input()
  protected name: string = "ปิยบุตร แสงกนกกุล";
  @Input()
  protected create: string = "10/12/2019 17:30:30";
  // SupportBar
  @Input()
  protected widthBar: string = "250pt";
  @Input()
  protected heightBar: string = "70pt";
  @Input()
  protected supported: number = 1500;
  @Input()
  protected max: number = 100;

  constructor() {

  }
}
