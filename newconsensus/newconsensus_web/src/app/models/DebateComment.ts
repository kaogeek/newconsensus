import { BaseModel } from './BaseModel';

export class DebateComment extends BaseModel{
  public id: number;
  public debateId: number;
  public comment: string;
  public likeCount: number;
  public dislikeCount: number;
}
