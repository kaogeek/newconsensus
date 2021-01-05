// import * as nock from 'nock';
// import request from 'supertest';
// import { runSeeder } from 'typeorm-seeding';
// import jwt from 'jsonwebtoken';

// import { User } from '../../../src/api/models/User';
// import { PageUser } from '../../../src/api/models/PageUser';
// import { User } from '../../../src/api/models/User';
// import { CreatePageUser } from '../../../src/database/seeds/CreatePageUser';
// import { RemovePageUser } from '../../../src/database/seeds/RemovePageUser';
// import { CreateTestAdminUser } from '../../../src/database/seeds/CreateTestAdminUser';
// import { RemoveTestAdminUser } from '../../../src/database/seeds/RemoveTestAdminUser';
// import { closeDatabase } from '../../utils/database';
// import { BootstrapSettings } from '../utils/bootstrap';
// import { prepareServer } from '../utils/server';
// import { Debate } from 'src/api/models/Debate';

// describe('/api/debate', () => {

//     let pageUser: PageUser;
//     let pageuserAuthorization: string;
//     let settings: BootstrapSettings;
//     let adminUser: User;
//     let adminAuthorization: string;
//     // debate
//     let debate: Debate;

//     // -------------------------------------------------------------------------
//     // Setup up
//     // -------------------------------------------------------------------------

//     beforeAll(async () => {
//         debate = {};
//         debate.title = 'title';
//         debate.content = 'content';
//         debate.dislikeCount = 1;
//         // create user
//         settings = await prepareServer({ migrate: false });
//         pageUser = await runSeeder<>(CreatePageUser);
//         pageuserAuthorization = Buffer.from(`${pageUser.username}:1234`).toString('base64');
//         // admin user
//         adminUser = await runSeeder<>(CreateTestAdminUser);
//         adminAuthorization = jwt.sign({id: adminUser.userId}, '123##$$)(***&');
//     });

//     // -------------------------------------------------------------------------
//     // Tear down
//     // -------------------------------------------------------------------------

//     afterAll(async () => {
//         // remove user
//         await runSeeder<>(RemovePageUser);
//         await runSeeder<>(RemoveTestAdminUser);
//         nock.cleanAll();
//         await closeDatabase(settings.connection);
//     });

//     // -------------------------------------------------------------------------
//     // Test cases
//     // -------------------------------------------------------------------------

//     // test('GET: / should return a list of users', async (done) => {
//     //     const response = await request(settings.app)
//     //         .get('/api/users')
//     //         .set('Authorization', `Basic ${pageuserAuthorization}`)
//     //         .expect('Content-Type', /json/)
//     //         .expect(200);

//     //     expect(response.body.length).toBe(1);
//     //     done();
//     // });

//     // test case for admin
//     test('POST: / should NOT return create debate for adminUser', async (done) => {
//         const response = await request(settings.app)
//             .post(`/api/debate`)
//             .set('Authorization', 'Bearer '+adminAuthorization)
//             .send({
//                 'title': debate.title,
//                 'content': debate.content,
//                 'dislikeCount': debate.dislikeCount
//             })
//             .expect('Content-Type', /json/)
//             .expect(200);
        
//         debate.debateId = response.body.data.debateId;
    
//         expect(response.body.data.title).toBe(debate.title);
//         expect(response.body.createdBy).toBe(adminUser.username);
//         // expect(response.body.email).toBe(pageUser.email);
//         done();
//     });

//     // all user
//     test('GET: /:id/ should return debate for any user', async (done) => {
//         const response = await request(settings.app)
//             .get(`/api/debate/${debate.debateId}`)
//             .expect('Content-Type', /json/)
//             .expect(200);

//         expect(response.body.data.debateId).toBe(debate.debateId);
//         done();
//     });

//     test('PUT: /:id/ should NOT edit debate by adminUser', async (done) => {
//         done();
//     });

//     test('DELETE: /:id/ should remove debate for adminUser', async (done) => {
//         const response = await request(settings.app)
//             .delete(`/api/debate/${debate.debateId}`)
//             .set('Authorization', 'Bearer '+adminAuthorization)
//             .expect('Content-Type', /json/)
//             .expect(200);

//         expect(response.body.data.debateId).toBe(debate.debateId);
//         done();
//     });

//     // testcase for normal user
//     test('POST: / should return create debate for normalUser', async (done) => {
//         const response = await request(settings.app)
//             .post(`/api/debate`)
//             .set('Authorization', 'Basic '+pageuserAuthorization)
//             .send({
//                 'title': debate.title,
//                 'content': debate.content,
//                 'dislikeCount': debate.dislikeCount
//             })
//             .expect('Content-Type', /json/)
//             .expect(200);
        
//         debate.debateId = response.body.data.debateId;
//         debate.createdBy = response.body.data.createdBy;
    
//         expect(response.body.data.title).toBe(debate.title);
//         expect(response.body.createdBy).toBe(pageUser.username);
//         done();
//     });

//     test('PUT: /:id/ should edit debate by normalUser', async (done) => {
//         done();
//     });

//     test('DELETE: /:id/ should NOT remove debate by normalUser', async (done) => {
//         done();
//     });
// });
