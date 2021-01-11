/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
