/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

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