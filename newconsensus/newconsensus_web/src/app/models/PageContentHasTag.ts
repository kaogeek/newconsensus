import { PageContent } from './PageContent';
import { Tag } from './Tag';
import { BaseModel } from './BaseModel';

export class PageContentHasTag extends BaseModel{
    public pageId: number;
    public tagId: number;
    public page: PageContent;
    public tag: Tag;
}
