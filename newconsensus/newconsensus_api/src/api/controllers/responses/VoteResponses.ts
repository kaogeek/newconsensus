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
