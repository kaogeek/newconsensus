/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';

export class SearchFilter {

    public limit: number;

    public offset: number;

    public select: any[];

    public relation: any[];

    public whereConditions: any;

    public orderBy: any;
    
    public count: boolean;

}
