/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class Proposal extends BaseModel {
  public id: any;
  public roomId: number;
  public title: string;
  public content: string;
  public reqSupporter: number;
  public approveUserid: any;
  public approveDate: Date;
  public likeCount: number;
  public dislikeCount: number;
  public endDate: Date;
  public debateTag: any[];
}
