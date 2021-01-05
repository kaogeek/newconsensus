import { BaseModel } from './BaseModel';

export class VoteComment extends BaseModel {
  public id: any
  public voteid: any
  public comment: string
  public likeCount: number
  public dislikeCount: number
  public value: number
}
