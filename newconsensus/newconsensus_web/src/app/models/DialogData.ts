/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EventEmitter } from '@angular/core';
import { BaseModel } from './BaseModel';

export class DialogData  extends BaseModel{

    width: string;
    height: string;
    title: string;
    text: string;
    bgColor: string;
    textColor: string;

    //bottom
    bottomText1: string;
    bottomText2: string;
    bottomColorText1: string;
    bottomColorText2: string;
    bottomColor1: string;
    bottomColor2: string;
    bottomBgColor1: string;
    bottomBgColor2: string;

    //set display bottom
    btDisplay1: string;
    btDisplay2: string;

    // btn action emitter
    confirmClickedEvent: EventEmitter<any>;
    cancelClickedEvent: EventEmitter<any>;

    // options
    options: any;
  }
