import { BaseModel } from './BaseModel';

export class Vote extends BaseModel {

  public id: number;
  public proposalId: number;
  public roomId: number;
  public content: string;
  public voteCount: number;
  public isActive: boolean;
  public likeCount: number;
  public dislikeCount: number;
  public endDate: Date;
  public link: string;
  public title: string;
}
