/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BaseModel } from "./BaseModel"

export class RegisterEmail extends BaseModel {
    
  public firstName: string;
  public lastName: string;
  public displayName: string;
  public avatar: string;
  public emailId: string;
  public gender: number;
  public birthday: Date;
  public postcode: number;
  public password: string;
  public confirmPassword: string;
  public identificationCode: string;
  public education: string;
  public career: string;
}
