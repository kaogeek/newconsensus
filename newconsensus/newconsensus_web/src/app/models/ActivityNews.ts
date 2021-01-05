import { BaseModel } from "./BaseModel"

export class ActivityNews extends BaseModel{
    public id: number;
    public title: string;
    public coverImageUrl: string;
    public coverVideoUrl: string;
    public startDateTime: Date;
    public endDateTime: Date;
    public latitude: string;
    public longitude: string;
    public placeName: string;
    public content: string;

}
