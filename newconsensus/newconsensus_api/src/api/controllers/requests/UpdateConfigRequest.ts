import { IsNotEmpty } from 'class-validator';

export class UpdateConfigRequest {
    public value: string;
    @IsNotEmpty()
    public type: string;
}
