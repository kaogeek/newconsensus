/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {Logger, LoggerInterface} from '../../decorators/Logger';
// import {Like} from 'typeorm/index';
import {RoomRepository} from '../repositories/RoomRepository';
import { Room } from '../models/Room';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class RoomService {

    constructor(@OrmRepository() private roomRepository: RoomRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // create room
    public async create(room: any): Promise<any> {
        this.log.info('Create a new room ');
        return this.roomRepository.save(room);
    }

    // find one room
    public findOne(room: any): Promise<any> {
        return this.roomRepository.findOne(room);
    }
     // find all room
     public findAll(): Promise<any> {
        this.log.info('Find all room');
        return this.roomRepository.find();
    }

    // edit room
    public edit(id: any, room: Room): Promise<any> {
        this.log.info('Edit a room');
        room.id = id;
        return this.roomRepository.save(room);
    }

    // room List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit,offset,select,relation,whereConditions,orderBy);
        if (count) {
            return this.roomRepository.count(condition);
        } else {
            return this.roomRepository.find(condition);
        }
    }

    // delete room
    public async delete(id: number): Promise<any> {
        return await this.roomRepository.delete(id);
    }
}
