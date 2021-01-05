/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class CreatePageContentRequest {

    @IsNotEmpty({
        message: 'title is required',
    })
    public title: string;

    @IsNotEmpty({
        message: 'content is required',
    })
    public content: string;

    public tagId: string;

    public metaTagTitle: string;

    public metaTagContent: string;

    public metaTagKeyword: string;

    public isDraft: boolean;

    public coverImage: string;

    public videoUrl: string;

    public viewCount: number;

    public imageUrl: string;

    public link: string;

    public description: string;
}
