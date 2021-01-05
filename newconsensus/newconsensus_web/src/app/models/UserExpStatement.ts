import { BaseModel } from './BaseModel';

export class UserExpStatement extends BaseModel{
    public id: number
    public userId: string
    public contentId: string
    public contentType: string
    public action: string
    public isFirst: boolean
    public valueExp: number

}
