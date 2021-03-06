/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BaseModel } from './BaseModel';

export class VoteComment extends BaseModel {
  public id: number
  public voteId: number
  public comment: string
  public likeCount: number
  public dislikeCount: number
  public value: string
}
