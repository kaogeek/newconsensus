/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PageUserLikeVoteComment } from '../models/PageUserLikeVoteComment';
import { PageUserLikeVoteCommentRepository } from '../repositories/PageUserLikeVoteCommentRepository';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class PageUserLikeVoteCommentService {

    constructor(@OrmRepository() private repository: PageUserLikeVoteCommentRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create PageUserLikeVoteComment
    public async create(pageUserLikeVoteComment: PageUserLikeVoteComment): Promise<PageUserLikeVoteComment> {

        if(pageUserLikeVoteComment.isLike){
            pageUserLikeVoteComment.isLike = true;
        } else {
            pageUserLikeVoteComment.isLike = false;
        }

        this.log.info('Create PageUser Like Vote Comment');

        return this.repository.save(pageUserLikeVoteComment);
    }

    // update PageUserLikeVoteComment
    public update(pageUserLikeVoteComment: PageUserLikeVoteComment): Promise<PageUserLikeVoteComment> {

        this.log.info('Update PageUser Like Vote Comment');

        return this.repository.save(pageUserLikeVoteComment);
    }

    // findone PageUserLikeVoteComment
    public findOne(content: any): Promise<PageUserLikeVoteComment> {
        return this.repository.findOne(content);
    }

    // delete PageUserLikeVoteComment
    public delete(uId: number, vId: number): Promise<any> {
        
        this.log.info('Delete PageUser Like Vote Comment');

        if(uId !== null && uId !== undefined){
            return this.repository.delete({userId: uId, voteCommentId: vId});
        } else {
            return this.repository.delete({voteCommentId: vId});
        }
    }

    // PageUserLikeVoteComment List
    public search(limit: number, offset: number, select: any, relation: any, whereConditions: any, orderBy: string, count: number | boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // find PageUserLikeVoteComment
    public find(content: any): Promise<any> {
        return this.repository.find(content);
    }
}