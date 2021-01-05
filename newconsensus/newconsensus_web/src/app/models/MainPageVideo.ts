import { BaseModel } from './BaseModel';

export class MainPageVideo extends BaseModel {
    public id: number;
    public url: string;
    public tagline: string;
    public ordering: number;
}
