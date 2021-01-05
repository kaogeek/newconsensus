import { BaseModel } from './BaseModel';

export class Config extends BaseModel {
    public id: any;
    public name: string;
    public type: string;
    public value: string;
}