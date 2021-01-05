import { BaseModel } from './BaseModel';

export class Debate extends BaseModel{
  public id: any;
  public title: string;
  public content: string;
  public likeCount: number;
  public dislikeCount: number;
}
