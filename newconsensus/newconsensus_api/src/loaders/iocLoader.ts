/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { useContainer as classValidatorUseContainer } from 'class-validator';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
// import { useContainer as typeGraphQLUseContainer } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

    /**
     * Setup routing-controllers to use typedi container.
     */
    routingUseContainer(Container);
    ormUseContainer(Container);
    classValidatorUseContainer(Container);
    // typeGraphQLUseContainer(Container);
};
