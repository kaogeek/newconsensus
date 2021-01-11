/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { PageContent } from './PageContent';
import { Tag } from './Tag';
import { BaseModel } from './BaseModel';

export class PageContentHasTag extends BaseModel{
    public pageId: number;
    public tagId: number;
    public page: PageContent;
    public tag: Tag;
}
