/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BaseModel } from './BaseModel';

export class UserExpStatement extends BaseModel{
    public id: number
    public userId: string
    public contentId: string
    public contentType: string
    public action: string
    public isFirst: boolean
    public valueExp: number

}
