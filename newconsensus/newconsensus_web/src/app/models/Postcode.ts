/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
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
