import { BaseModel } from './BaseModel';

export class VoteComment extends BaseModel {
  public id: number
  public voteId: number
  public comment: string
  public likeCount: number
  public dislikeCount: number
  public value: string
}
