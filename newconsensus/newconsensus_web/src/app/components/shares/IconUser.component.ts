/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { OnInit, Component, Input } from '@angular/core';
import { PageUserInfo } from '../../services/PageUserInfo.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'newcon-icon-user',
    templateUrl: './IconUser.component.html',
})
export class IconUser implements OnInit {

    @Input()
    protected class: string | string[];
    @Input()
    protected pageUser: any; 

    public pageUserInfo: PageUserInfo; 

    constructor(pageUserInfo: PageUserInfo) {
        this.pageUserInfo = pageUserInfo;
    }

    ngOnInit(): void {
        // console.log(this.pageUser.currentExp);
        // const level = Math.max( Math.floor( 8.7 * Math.log( this.pageUser.currentExp  + 111 ) + (-40) ), 1 )
        // console.log('length ',level); 

    }

}
