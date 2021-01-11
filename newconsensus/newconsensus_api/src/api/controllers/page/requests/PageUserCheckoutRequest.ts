/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {IsNotEmpty, IsEmail , IsString } from 'class-validator';
export class PageUserCheckoutRequest {
    @IsNotEmpty({
        message: 'Shipping First name is required',
    })
    public shippingFirstName: string;

    public shippingLastName: string;
    @IsNotEmpty({
        message: 'Shipping Address 1 is required',
    })
    public shippingAddress_1: string;
    @IsNotEmpty({
        message: 'Shipping City is required',
    })
    @IsString()
    public shippingCity: string;

    @IsNotEmpty({
        message: 'Shipping Post Code is required',
    })
    public shippingPostCode: number;
    @IsNotEmpty({
        message: 'Shipping Country is required',
    })
    @IsString()
    public shippingCountry: string;
    @IsNotEmpty({
        message: 'Shipping Zone is required',
    })
    public shippingZone: string;

    @IsNotEmpty({
        message: 'Phone Number is required',
    })
    public phoneNumber: number;

    @IsEmail()
    @IsNotEmpty({
        message: 'Email Id is required',
    })
    public emailId: string;
    public shippingAddress_2: string;
    public shippingCompany: string;
    public shippingAddressFormat: string;

    @IsNotEmpty()
    public productDetails: [];
}
