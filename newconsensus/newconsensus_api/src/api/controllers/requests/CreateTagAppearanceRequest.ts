import { IsNotEmpty } from 'class-validator';

export class CreateTagAppearanceRequest {
    @IsNotEmpty()
    public tag: string;
    @IsNotEmpty()
    public contentId: number;
    @IsNotEmpty()
    public type: string;
    
    public countAppearance: number;
}
