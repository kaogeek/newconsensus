import { BaseModel } from './BaseModel';

export class Postcode extends BaseModel {
  public id: number
  public district: string;
  public amphoe: string;
  public province: string;
  public postcode: number;
  public district_code: string;
  public amphoe_code: string;
  public province_code: string; 
}
