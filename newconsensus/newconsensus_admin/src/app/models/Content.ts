/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

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