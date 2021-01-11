/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BaseModel } from './BaseModel';
import { PageContentHasTag } from './PageContentHasTag';

export class PageContent extends BaseModel {

    public id: number;
    public title: string;
    public content: string;
    public coverImage: string;
    public metaTagTitle: string;
    public metaTagContent: string;
    public metaTagKeyword: string;
    public isActive: number;
    public view_count: number;
    public videoUrl: string;
    public link: string;
    public createdByUsername: string;
    public modifiedByUsername: string;
    public pageId: PageContentHasTag[];
}
