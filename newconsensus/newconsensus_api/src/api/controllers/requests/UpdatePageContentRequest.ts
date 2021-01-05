/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class UpdatePageContent {
    
    @IsNotEmpty({
        message: 'title is required',
    })
    public title: string;

    @IsNotEmpty({
        message: 'content is required',
    })
    public content: string;

    public tagId: string;

    public isDraft: boolean;

    public metaTagTitle: string;

    public metaTagContent: string;

    public metaTagKeyword: string;

    public coverImage: string;

    public view_count: number;

    public videoUrl: string;

    public imageUrl: string;

    public link: string;

    public description: string;
}
