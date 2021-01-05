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
