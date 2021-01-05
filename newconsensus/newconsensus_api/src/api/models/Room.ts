import { Column, PrimaryGeneratedColumn, Entity, BeforeUpdate, BeforeInsert } from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment/moment');

@Entity('room')
export class Room extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'color' })
    public color: string;

    @Column({ name: 'description' })
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
