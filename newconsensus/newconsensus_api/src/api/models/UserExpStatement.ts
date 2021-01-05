import { Column, PrimaryGeneratedColumn, Entity, BeforeInsert } from 'typeorm';
import moment = require('moment/moment');
import { IsNotEmpty } from 'class-validator';

@Entity('user_exp_statement')
export class UserExpStatement {

    @PrimaryGeneratedColumn({ name: 'id' })
    @IsNotEmpty()
    public id: number;

    @Column({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'content_id' })
    public contentId: string;

    @Column({ name: 'content_type' })
    public contentType: string;

    @Column({ name: 'action' })
    public action: string;

    @Column({ name: 'is_first' })
    public isFirst: boolean;

    @Column({ name: 'value_exp' })
    public valueExp: number;

    @Column({ name: 'datetime' })
    public createdDate: Date;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }
}
