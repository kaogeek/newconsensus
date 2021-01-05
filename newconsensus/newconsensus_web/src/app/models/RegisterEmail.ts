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
