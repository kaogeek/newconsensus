/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
