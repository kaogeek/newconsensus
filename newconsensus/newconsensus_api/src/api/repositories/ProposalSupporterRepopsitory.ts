/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { ProposalSupporter } from '../models/ProposalSupporter';

@EntityRepository(ProposalSupporter)
export class ProposalSupporterRepopsitory extends Repository<ProposalSupporter>  {

}
