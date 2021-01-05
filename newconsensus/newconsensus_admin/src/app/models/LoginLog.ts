import { BaseModel } from './BaseModel';

export class LoginLog extends BaseModel {
    public id: number;
    public userId: number;
    public emailId: string;
    public firstName: string;
    public ipAddress: string;
}