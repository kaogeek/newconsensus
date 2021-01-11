/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

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
