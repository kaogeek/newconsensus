import { BaseModel } from './BaseModel';

export class MainPageSlide extends BaseModel {
  public id: number;
  public videoUrl: string;
  public imageUrl: string;
  public ordering: number;
  public isAutoPlay: boolean;
  public delayMiliSec: number;
}
