/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Tag } from '../models/Tag';
import { TagRepository } from '../repositories/TagRepository';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class TagService {

    constructor(@OrmRepository() private tagsRepository: TagRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // find one condition
    public findOne(tag: any): Promise<any> {
        return this.tagsRepository.findOne(tag);
    }

    // find all tag
    public findAll(): Promise<any> {
        this.log.info('Find all tag');
        return this.tagsRepository.find();
    }

    public findAlls(tag: any): Promise<any> {
        this.log.info('Find all tagId');
        return this.tagsRepository.find(tag);
    }

    // tag list
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
      
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.tagsRepository.count(condition);
        } else {
            return this.tagsRepository.find(condition);
        }
    }

    // create tag
    public async create(tags: Tag): Promise<Tag> {
        const newSettings = await this.tagsRepository.save(tags);
        return newSettings;
    }

    // update tag
    public update(id: any, tags: Tag): Promise<Tag> {
        this.log.info('Update a tag');
        tags.id = id;
        return this.tagsRepository.save(tags);
    }

    // delete tag
    public async delete(id: any): Promise<any> {
        this.log.info('Delete a tag');
        const newSettings = await this.tagsRepository.delete(id);
        return newSettings;
    }
}
