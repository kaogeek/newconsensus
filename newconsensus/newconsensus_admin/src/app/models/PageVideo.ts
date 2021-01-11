/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class PageVideo extends BaseModel{
    public id: any;   
    public url: string;   
    public tagline: string;   
    public ordering: number;
}
