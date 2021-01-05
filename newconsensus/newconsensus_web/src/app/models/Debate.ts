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
