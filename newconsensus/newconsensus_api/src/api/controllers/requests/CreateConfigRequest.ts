import { IsNotEmpty } from 'class-validator';

export class CreateConfigRequest {
    @IsNotEmpty()
    public name: string;
    public value: string;
    @IsNotEmpty()
    public type: string;
}
