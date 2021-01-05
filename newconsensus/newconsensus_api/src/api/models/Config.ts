import { Entity, Column, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment');

@Entity('config')
export class Config extends BaseModel  {

    @PrimaryColumn({name: 'name'})
    public name: string;

    @Column({name: 'value'})
    public value: string;

    @Column({name: 'type'})
    public type: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
