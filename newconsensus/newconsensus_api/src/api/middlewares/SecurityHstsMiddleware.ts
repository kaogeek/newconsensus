/*
 * NewConsensus API
 * version 2.2
 * http://api.NewConsensus.com
 *
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import * as express from 'express';
import * as helmet from 'helmet';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityHstsMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const options = {
            maxAge: 31536000,
            includeSubDomains: true,
        };
        return helmet.hsts(options)(req, res, next); 
    }

}
