// import { Debate } from '../../../src/api/models/Debate';
// import { DebateService } from '../../../src/api/services/DebateService';
// import { LogMock } from '../lib/LogMock';
// import { RepositoryMock } from '../lib/RepositoryMock';

// describe('DebateService', () => {

//     let debateList = function(){
//         const debate = new Debate();
//         debate.debateId =  1;
//         debate.title = 'debate1';
//         debate.content = 'testDescription1';
//         debate.dislikeCount = 1;

//         const debate2 = new Debate();
//         debate2.debateId =  2;
//         debate2.title = 'debate2';
//         debate2.content = 'testDescription2';
//         debate2.dislikeCount = 1;

//         return [debate, debate2];
//     };

//     // find
//     test('Find should return a debate', async (done) => {
//         const log = new LogMock();
//         const repo = new RepositoryMock();
//         const debateResult = debateList();
//         const debate = debateResult[0];
//         repo.list = debateResult;
        
//         const service = new DebateService(repo as any,log);
//         const list = await service.find(debate);
//         expect(list[0].title).toBe(debate.title);

//         done();
//     });

//     // list
//     test('List should return a list of debate', async (done) => {
//         const log = new LogMock();
//         const repo = new RepositoryMock();
//         const debateResult = debateList();
//         repo.list = debateResult;

//         const service = new DebateService(repo as any,log);
//         const queryFilter = {
//             limit: null,
//             offset: null,
//             search: null,
//             whereConditions: null,
//             order: null,
//             count: false
//         };
//         const list = await service.list(queryFilter.limit, queryFilter.offset, queryFilter.search, 
//             queryFilter.whereConditions, queryFilter.order, queryFilter.count);
//         expect(list.length).toEqual(2)

//         done();
//     });

//     test('Create should create a debate', async (done) => {
//         const log = new LogMock();
//         const repo = new RepositoryMock();
//         const debate = new Debate();
//         debate.debateId =  1;
//         debate.title = 'debate test';
//         debate.content = 'test test test';
//         debate.dislikeCount = 1;
//         // create debate
//         const service = new DebateService(repo as any,log);
//         const newDebate = await service.create(debate);
//         expect(newDebate).not.toBeNull();
//         expect(newDebate.title).toEqual(debate.title);
//         expect(newDebate.content).toEqual(debate.content);
//         expect(newDebate.dislikeCount).toEqual(debate.dislikeCount);

//         done();
//     });

//     // Delete
//     test('Delete should delete a debate', async (done) => {
//         const log = new LogMock();
//         const repo = new RepositoryMock();
//         const debate = new Debate();
//         debate.debateId =  1;
//         debate.title = 'debate test';
//         debate.content = 'test test test';
//         debate.dislikeCount = 1;
//         // create debate
//         const service = new DebateService(repo as any,log);
//         await service.create(debate);
//         // remove debate
//         await service.delete(debate.debateId);
//         // find debate
//         const findDebate = await service.findOne(debate.debateId);
//         expect(findDebate).toBeUndefined();

//         done();
//     });

// });
