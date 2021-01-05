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
