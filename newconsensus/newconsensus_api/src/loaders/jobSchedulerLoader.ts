/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { env } from '../env';
import * as schedule from 'node-schedule';
import * as http from 'http';

/* 
* this will set job schedule for hot score calculate
*/
export const jobSchedulerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

    // run every minute
    // calculate hot debate
    schedule.scheduleJob('*/3 * * * *', ()=>{
        const hotDebateOptions: any = {
            host: env.app.host,
            port: env.app.port,
            path: env.app.routePrefix+'/hot/debate',
            method: 'POST',
            body: {
                limit: 5
            }
        };
        http.request(hotDebateOptions, (res)=>{
            console.log(`DEBATE HOT SCORE STATUS: ${res.statusCode}`);
            
            // reset debate
            const resetHotDebateOptions: any = {
                host: env.app.host,
                port: env.app.port,
                path: env.app.routePrefix+'/hot/debate/reset',
                method: 'POST',
                body: {
                }
            };
            http.request(resetHotDebateOptions, (resetRes)=>{
                console.log(`RESET DEBATE HOT SCORE STATUS: ${resetRes.statusCode}`);
            })
            .on('error', (err)=> {
                // Handle error
                console.log('err: '+err);
            })
            .end();
        })
        .on('error', (err)=> {
            // Handle error
            console.log('err: '+err);
        })
        .end();
    });

    // calculate hot proposal
    schedule.scheduleJob('*/3 * * * *', ()=>{

        const hotProposalOptions: any = {
            host: env.app.host,
            port: env.app.port,
            path: env.app.routePrefix+'/hot/proposal',
            method: 'POST',
            body: {
                limit: 5
            }
        };
        http.request(hotProposalOptions, (res)=>{
            console.log(`PROPOSAL HOT SCORE STATUS: ${res.statusCode}`);

            // reset proposal hotScore
            const resetHotProposalOptions: any = {
                host: env.app.host,
                port: env.app.port,
                path: env.app.routePrefix+'/hot/proposal/reset',
                method: 'POST',
                body: {
                }
            };
            http.request(resetHotProposalOptions, (resProposal)=>{
                console.log(`RESET PROPOSAL HOT SCORE STATUS: ${resProposal.statusCode}`);
            })
            .on('error', (err)=> {
                // Handle error
                console.log('err: '+err);
            })
            .end();
        })
        .on('error', (err)=> {
            console.log('err: '+err);
        })
        .end();
    });

    // calculate trending score
    // schedule.scheduleJob('0 0 * ? * *', ()=>{
    schedule.scheduleJob('0 0 * ? * *', ()=> {

        const trendingScoreRelateTagOptions: any = {
            host: env.app.host,
            port: env.app.port,
            path: env.app.routePrefix+'/relatetag/trendingscore',
            method: 'POST',
            body: {
                
            }
        };
        http.request(trendingScoreRelateTagOptions, (res)=>{
            console.log(`RELATE TAG TRENDING SCORE STATUS: ${res.statusCode}`);
        })
        .on('error', (err)=> {
            console.log('err: '+err);
        })
        .end();
    });
};
