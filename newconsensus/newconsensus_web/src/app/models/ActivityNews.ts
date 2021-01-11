/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BaseModel } from "./BaseModel"

export class ActivityNews extends BaseModel{
    public id: number;
    public title: string;
    public coverImageUrl: string;
    public coverVideoUrl: string;
    public startDateTime: Date;
    public endDateTime: Date;
    public latitude: string;
    public longitude: string;
    public placeName: string;
    public content: string;

}
