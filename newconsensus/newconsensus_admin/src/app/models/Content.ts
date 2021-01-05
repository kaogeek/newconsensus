import { BaseModel } from './BaseModel';

export class Content extends BaseModel {
  public id: any;
  public title: string;
  public content: string;
  public description: string;
  public metaTagTitle: string;
  public metaTagContent: string;
  public metaTagKeyword: string;
  public isDraft:	boolean;	  
  public coverImage:	string;
  public videoUrl:	string;	
  public imageUrl:	string;
  public tagId:	number[];	
  public link:	string;	
}