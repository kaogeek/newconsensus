import { BaseModel } from './BaseModel';

export class Vote extends BaseModel {
  
  public id: any;
  public proposalId: number;
  public roomId: number;
  public title: string;
  public content: string;
  public description: string;
  public coverImage: string;
  public tagline: string;
  public isActive:	Boolean;
  public link: string;
  public videoUrl: string;
  public imageUrl: string;
  public endDate: Date;

}
