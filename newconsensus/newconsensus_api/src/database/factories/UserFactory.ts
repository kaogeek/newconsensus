/*
 * NewConsensus API
 * version 2.0.0
 * http://api.NewConsensus.com
 *
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../api/models/User';
define(User, (faker: typeof Faker, settings: { role: string []}) => {
    const user = new User();
    return user;
});
