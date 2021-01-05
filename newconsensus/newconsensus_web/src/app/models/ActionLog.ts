import { BaseModel } from './BaseModel';

export class ActionLog extends BaseModel {
  public contentId: number
  public contentType: string
  public action: string
}
