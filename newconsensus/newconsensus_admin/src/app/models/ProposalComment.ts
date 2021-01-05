import { BaseModel } from './BaseModel';

export class ProposalComment extends BaseModel{
  public id: any;
  public proposalid: any;
  public comment: string;
  public likeCount: number;
  public dislikeCount: number;
}
