/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { UserGroup } from '../models/UserGroup';

@EntityRepository(UserGroup)
export class UserGroupRepository extends Repository<UserGroup>  {

}
