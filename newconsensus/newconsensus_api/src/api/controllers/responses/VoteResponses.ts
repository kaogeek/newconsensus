/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

export default  {
    data(): any{
        return {
            id: -1,
            vote: {},
            voteComment: {
                agree: {
                    percent: 0,
                    voteComments: [],
                },
                disagree: {
                    percent: 0,
                    voteComments: [],
                },
                noComment: {
                    percent: 0,
                    voteComments: [],
                },
            },
        };
    },
};
