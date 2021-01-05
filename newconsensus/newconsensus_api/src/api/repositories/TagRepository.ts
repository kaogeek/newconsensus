/*
 * spurtcommerce API
 * version 3.0
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository} from 'typeorm';
import { Tag } from '../models/Tag';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag>  {
 
}
