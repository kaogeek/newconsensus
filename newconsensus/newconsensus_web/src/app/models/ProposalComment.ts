import { BaseModel } from './BaseModel';

export class ProposalComment extends BaseModel{
  public id: number;
  public proposalId: number;
  public comment: string;
  public likeCount: number;
  public dislikeCount: number;
  public isLike: boolean;
}
