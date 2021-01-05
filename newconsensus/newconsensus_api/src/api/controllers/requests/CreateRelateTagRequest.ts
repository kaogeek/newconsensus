import { IsNotEmpty } from 'class-validator';

export class CreateRelateTagRequest {
    @IsNotEmpty()
    public name: string;
    
    public trendingScore: number;
}
