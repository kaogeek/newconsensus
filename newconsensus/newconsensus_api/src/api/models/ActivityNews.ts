import { BaseModel } from './BaseModel';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import moment = require('moment');

@Entity('activity_news')
export class ActivityNews extends BaseModel{
    
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'title'})
    public title: string;

    @Column({name: 'cover_image_url'})
    public coverImageUrl: string;

    @Column({name: 'cover_video_url'})
    public coverVideoUrl: string;

    @Column({name: 'start_date_time'})
    public startDateTime: Date;

    @Column({name: 'end_date_time'})
    public endDateTime: Date;

    @Column({name: 'latitude'})
    public latitude: number;

    @Column({name: 'longitude'})
    public longitude: number;

    @Column({name: 'place_name'})
    public placeName: string;

    @Column({name: 'content'})
    public content: string;

    @Column({ name: 'description'})
    public description: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
