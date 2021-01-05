import { BaseModel } from './BaseModel';

export class User extends BaseModel {
  public id: number;
  public userGroupId: number;
  public username: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public avatar: string;
  public avatarPath: string;
  public isActive: number;
  public code: string;
  public ip: string;
  public phoneNumber: string;
  public address: string;
  public deleteFlag: number;
}