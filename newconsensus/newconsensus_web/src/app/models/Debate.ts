/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BaseModel } from './BaseModel';

export class Debate extends BaseModel{
  public id: number;
  public title: string;
  public content: string;
  public likeCount: number;
  public dislikeCount: number;
  public pinOrdering: number;
  public hotScore: number;
}
