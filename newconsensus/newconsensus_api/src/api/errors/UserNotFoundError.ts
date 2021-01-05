/*
 * NewConsensus API
 * version 2.2
 * http://api.NewConsensus.com
 *
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {
    constructor() {
        super(404, 'User not found!');
    }
}
