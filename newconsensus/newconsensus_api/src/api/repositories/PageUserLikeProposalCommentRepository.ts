/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { PageUserLikeProposalComments } from '../models/PageUserLikeProposalComments';

@EntityRepository(PageUserLikeProposalComments)
export class PageUserLikeProposalCommentRepository extends Repository<PageUserLikeProposalComments> {

}
