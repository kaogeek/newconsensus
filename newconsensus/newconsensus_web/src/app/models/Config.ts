import { BaseModel } from './BaseModel';

export class Config extends BaseModel  {

    public name: string;
    public value: any;
    public type: string;
}
