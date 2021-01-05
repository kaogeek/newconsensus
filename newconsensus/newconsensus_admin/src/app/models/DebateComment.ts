import { BaseModel } from './BaseModel';

export class DebateComment extends BaseModel{
  public id: any;
  public debateId: any;
  public comment: string;
  public likeCount: number;
  public dislikeCount: number;
}
