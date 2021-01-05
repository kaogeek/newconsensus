import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class UpdateRoomRequest {

    @IsNotEmpty({
        message: 'room is required',
    })
    public name: string;
    public description: string;
    public color: string;
}
