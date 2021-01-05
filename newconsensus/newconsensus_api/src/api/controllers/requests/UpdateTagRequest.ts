import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class UpdateTagRequest {
    @IsNotEmpty({
        message: 'tag is required',
    })
    public name: string;
    public description: string;
}
