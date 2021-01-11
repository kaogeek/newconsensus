/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { UserGroup } from '../../api/models/UserGroup';
define(UserGroup, (faker: typeof Faker, settings: { role: string []}) => {
    const usergroup = new UserGroup();
    return usergroup;
});
