import { BaseModel } from './BaseModel';

export class Activity extends BaseModel {
    public id: any;
    public title: string;
    public coverImageUrl: string;
    public coverVideoUrl: string;
    public startDateTime: Date;
    public endDateTime: Date;
    public latitude: number;
    public longitude: number;
    public placeName: string;
    public content: string;
    public description: string;
}