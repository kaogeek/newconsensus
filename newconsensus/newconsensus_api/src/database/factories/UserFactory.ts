/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../api/models/User';
define(User, (faker: typeof Faker, settings: { role: string []}) => {
    const user = new User();
    return user;
});
