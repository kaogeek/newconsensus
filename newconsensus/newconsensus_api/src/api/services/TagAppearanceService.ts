/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { In } from 'typeorm';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { TagAppearanceRepository } from '../repositories/TagAppearanceRepository';
import { TagAppearance } from '../models/TagAppearance';
import { TAG_CONTENT_TYPE } from '../../TagContentType';
import { ProposalRepository } from '../repositories/ProposalRepository';
import { DebateRepository } from '../repositories/DebateRepository';
import { VoteRepository } from '../repositories/VoteRepository';
import { RelateTagService } from './RelateTagService';
import { RelateTag } from '../models/RelateTag';

@Service()
export class TagAppearanceService {
    constructor(@OrmRepository() private tagAppearanceRepository: TagAppearanceRepository
    , @OrmRepository() private proposalRepository: ProposalRepository
    , @OrmRepository() private debateRepository: DebateRepository
    , @OrmRepository() private voteRepository: VoteRepository
    , private relateTagService: RelateTagService
    , @Logger(__filename) private log: LoggerInterface) {
    }

    // create tagAppearance
    public async create(tagAppearance: any): Promise<any> {
        this.log.info('Create a new tagAppearance ');
        return this.tagAppearanceRepository.save(tagAppearance);
    }

    // find one tagAppearance
    public findOne(tagAppearance: any): Promise<any> {
        return this.tagAppearanceRepository.findOne(tagAppearance);
    }

    // find all tagAppearance
    public findAll(findCondition: any): Promise<any> {
        this.log.info('Find all tagAppearance');
        return this.tagAppearanceRepository.find(findCondition);
    }

    // edit tagAppearance
    public edit(tagAppearance: TagAppearance): Promise<any> {
        this.log.info('Edit a tagAppearance');
        return this.tagAppearanceRepository.save(tagAppearance);
    }

    public getTagAppearance(tagName: string, conId: number, typeContent: string): Promise<any> {
        const condition = {
            where: {
                tag: tagName,
                contentId: conId,
                type: typeContent,
            },
        };

        return this.tagAppearanceRepository.findOne(condition);
    }

    public async getRelateContent(conId: number, typeContent: string, count?: number, pagination?: number): Promise<any> {

        let tagAppearances: any[] = [];

        if(count === undefined) {
            count = 5;
        }

        const tagAppearance1 = await this.tagAppearanceRepository.find({ // content find tags
            where: {
                contentId: conId,
                type: typeContent,
            },
        });

        const tags: any[] = [];

        for (const ta1 of tagAppearance1) {
            tags.push(ta1.tag);
        }

        if(tags === null || tags === undefined || tags.length <=0){
            return Promise.resolve([]);
        }

        tagAppearances = await this.tagAppearanceRepository.find({ // tags find content
            where: {
                tag: In(tags),
                type: typeContent,
            },
        });

        const myContent: any = {}; // push myContent

        const result: any = tagAppearances.filter(d => { // filter content other not myContent
            if (d.contentId === conId) {
                myContent[d.tag] = d;
                return false;
            } else {
                return d.contentId !== conId;
            }
        });

        const appearance: any = {}; 
        let isHasAppearance = false;

        // appearance = {
        //     contentId1: countAppearance1,
        //     contentId2: countAppearance2,
        //     contentId3: countAppearance3,
        // }

        result.forEach((d: any) => {
            const key: any = d.tag;

            if (myContent[key] !== undefined) { // calculate countAppearance content
                appearance[d.contentId] = (appearance[d.contentId] === undefined ? 0 : appearance[d.contentId]) + (myContent[key].countAppearance * d.countAppearance);
            
                if(!isHasAppearance){
                    isHasAppearance = true;
                }
            }
        });

        if(!isHasAppearance) {
            return Promise.resolve([]);
        }

        const dataContents: any[] = [];
        let dataContentSorts: any[] = [];

        if (typeContent === TAG_CONTENT_TYPE.PROPOSAL) {
            dataContentSorts = await this.proposalRepository.find({
                where: {
                    id: In(Object.keys(appearance)),
                },
            });
        } else if(typeContent === TAG_CONTENT_TYPE.DEBATE) {
            dataContentSorts = await this.debateRepository.find({
                where: {
                    id: In(Object.keys(appearance)),
                },
            });
        } else if(typeContent === TAG_CONTENT_TYPE.VOTE) {
            dataContentSorts = await this.voteRepository.find({
                where: {
                    id: In(Object.keys(appearance)),
                },
            });
        }

        for (const d of dataContentSorts) {
            if (appearance[d.id] !== undefined) {

                if(dataContents.length === count){
                    break;
                }
                
                dataContents.push({
                    data: d,
                    countAppearance: appearance[d.id],
                });
            }
        }

        // sort countAppearance 
        dataContents.sort((a, b) => (a.countAppearance < b.countAppearance) ? 1 : -1);

        return new Promise((resolve, reject) => {
            return resolve(dataContents);
        });
    }

    // tagAppearance List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.tagAppearanceRepository.count(condition);
        } else {
            return this.tagAppearanceRepository.find(condition);
        }
    }

    // delete tagAppearance
    public async delete(condition: any): Promise<any> {
        return await this.tagAppearanceRepository.delete(condition);
    }

    // create tagAppearance
    public async createTagAppearance(content: any, relateTags: string[], type: string, user: any): Promise<any> {
        if(relateTags === undefined || relateTags.length<=0) {
            return new Promise((resolve, reject) => {
                return resolve();
            });
        }

        if(user === undefined) {
            return new Promise((resolve, reject) => {
                return resolve();
            });
        }

        const dataTagAp: any[] = [];

        for (const d of relateTags) {

            // check relateTag
            const rtag: any = await this.relateTagService.getRelateTag(d);

            if(rtag === undefined) {
                const relateTag = new RelateTag();

                relateTag.name = d;
                relateTag.trendingScore = 0;
                relateTag.createdBy = user.id;
                relateTag.createdByUsername = user.username;
                try {
                    await this.relateTagService.create(relateTag);
                }catch(error) {
                    continue;
                }
            }

            const tagAppearance = new TagAppearance();
            tagAppearance.contentId = content.id;
            tagAppearance.tag = d;
            tagAppearance.type = type;
            tagAppearance.createdBy = user.id;
            tagAppearance.createdByUsername = user.username;

            let countAppearance: number;

            countAppearance = content.content.split(d).length > 0 ? content.content.split(d).length - 1 : 0; // content
            countAppearance += content.title.split(d).length > 0 ? content.title.split(d).length - 1 : 0; // title

            tagAppearance.countAppearance = countAppearance;

            try {
                const tagApp: any = await this.create(tagAppearance);
                
                dataTagAp.push(tagApp);
            }catch(error) {
                console.log(error);
            }
        }

        return new Promise((resolve, reject) => {
            return resolve(dataTagAp);
        });
    }

    // update tagAppearance
    public async updateTagAppearance(content: any, relateTags: string[], typeContent: string, user: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if(content === undefined) {
               return resolve([]);
            }

            if(relateTags === undefined || relateTags.length <= 0) {
                return resolve([]);
            }

            this.delete({ contentId: content.id, type: typeContent }).then(()=>{

                this.createTagAppearance(content, relateTags, typeContent, user).then((result: any)=>{
                    resolve(result);
                }).catch((error) => { reject(error); });
            }).catch((error) => { reject(error); });
        });
    }
}
