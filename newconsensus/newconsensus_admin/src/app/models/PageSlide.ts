import { BaseModel } from './BaseModel';

export class PageSlide extends BaseModel{
  public id: any;
  public videoUrl: string;
  public imageUrl: string;
  public ordering: number;
  public delayMiliSec: number;
  public isAutoPlay: boolean;
}
