import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment');

@Entity('partner')
export class Partner extends BaseModel  {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'link'})
    public link: string;

    @Column({name: 'logo_url'})
    public logoUrl: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
