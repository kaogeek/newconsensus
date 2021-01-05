import * as nock from 'nock';
import request from 'supertest';
import { runSeeder } from 'typeorm-seeding';
import jwt from 'jsonwebtoken';

import { User } from '../../../src/api/models/User';
import { PageUser } from '../../../src/api/models/PageUser';
import { User } from '../../../src/api/models/User';
import { CreatePageUser } from '../../../src/database/seeds/CreatePageUser';
import { RemovePageUser } from '../../../src/database/seeds/RemovePageUser';
import { CreateTestAdminUser } from '../../../src/database/seeds/CreateTestAdminUser';
import { RemoveTestAdminUser } from '../../../src/database/seeds/RemoveTestAdminUser';
import { closeDatabase } from '../../utils/database';
import { BootstrapSettings } from '../utils/bootstrap';
import { prepareServer } from '../utils/server';
import { Tag } from 'src/api/models/Tag';

describe('/api/tag', () => {

    let pageUser: PageUser;
    let pageuserAuthorization: string;
    let settings: BootstrapSettings;
    let adminUser: User;
    let adminAuthorization: string;
    // tag
    let tag: Tag;

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        tag = {
            name: 'TAG_NAME',
            description: 'TAG_DESC'
        };
        // create user
        settings = await prepareServer({ migrate: false });
        pageUser = await runSeeder<>(CreatePageUser);
        pageuserAuthorization = Buffer.from(`${pageUser.username}:1234`).toString('base64');
        // admin user
        adminUser = await runSeeder<>(CreateTestAdminUser);
        adminAuthorization = jwt.sign({id: adminUser.userId}, '123##$$)(***&');
    });

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(async () => {
        // remove user
        await runSeeder<>(RemovePageUser);
        await runSeeder<>(RemoveTestAdminUser);
        nock.cleanAll();
        await closeDatabase(settings.connection);
    });

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    // admin
    test('POST: admin/ should create tag by adminUser', async (done) => {
        const response = await request(settings.app)
            .post(`/api/admin/tag`)
            .set('Authorization', 'Bearer '+adminAuthorization)
            .send({
                name: tag.name,
                description: tag.description
            })
            .expect('Content-Type', /json/)
            .expect(200);
        
        tag.tagId = response.body.data.tagId;
    
        expect(response.body.data.name).toBe(tag.name);
        expect(response.body.data.description).toBe(tag.description);
        done();
    });

    test('PUT: admin/:id/ should edit tag by adminUser', async (done) => {
        const response = await request(settings.app)
            .put(`/api/admin/tag/`+tag.tagId)
            .set('Authorization', 'Bearer '+adminAuthorization)
            .send({
                name: tag.name+' edit',
                description: tag.description+' edit'
            })
            .expect('Content-Type', /json/)
            .expect(200);
    
        expect(response.body.data.name).toBe(tag.name+' edit');
        expect(response.body.data.description).toBe(tag.description+' edit');
        
        done();
    });

    test('GET: admin/:id/ should get tag by adminUser', async (done) => {
        const response = await request(settings.app)
            .get(`/api/admin/tag/`+tag.tagId)
            .set('Authorization', 'Bearer '+adminAuthorization)
            .expect('Content-Type', /json/)
            .expect(200);
    
        expect(response.body.data).toBeDefined();
        
        done();
    });

    test('POST: admin/ should NOT create tag by normalUser', async (done) => {
        const response = await request(settings.app)
            .post(`/api/admin/tag`)
            .set('Authorization', 'Basic '+pageuserAuthorization)
            .send({
                name: tag.name,
                description: tag.description
            })
            .expect('Content-Type', /json/)
            .expect(401); // forbidden
        
        done();
    });

    test('PUT: admin/:id/ should NOT edit tag by normalUser', async (done) => {
        const response = await request(settings.app)
            .put(`/api/admin/tag`)
            .set('Authorization', 'Basic '+pageuserAuthorization)
            .send({
                name: 'change',
                description: 'change'
            })
            .expect('Content-Type', /json/)
            .expect(401); // forbidden

        done();
    });

    test('GET: admin/:id/ should NOT get tag by normalUser', async (done) => {
        const response = await request(settings.app)
            .get(`/api/admin/tag/`+tag.tagId)
            .set('Authorization', 'Basic '+pageuserAuthorization)
            .expect('Content-Type', /json/)
            .expect(401);
    
            done();
    });

    test('DELETE: admin/:id/ should NOT remove tag by normalUser', async (done) => {
        const response = await request(settings.app)
            .get(`/api/admin/tag/`+tag.tagId)
            .set(Authorization, 'Basic '+pageuserAuthorization)
            .expect('Content-Type', /json/)
            .expect(401);
    
        done();
    });

    test('DELETE: admin/:id/ should delete tag by adminUser', async (done) => {
        const response = await request(settings.app)
            .delete(`/api/admin/tag/`+tag.tagId)
            .set(Authorization, 'Bearer '+adminAuthorization)
            .expect('Content-Type', /json/)
            .expect(200);
    
        expect(response.body.data.value).toBe(true);
        done();
    });

    // normaluser
    test('POST: / should NOT create tag by normalUser', async (done) => {
        done();
    });

    test('PUT: /:id/ should NOT edit tag by normalUser', async (done) => {
        done();
    });

    test('GET: /:id/ should get tag by normalUser', async (done) => {
        
        done();
    });

    test('DELETE: /:id/ should NOT remove tag by normalUser', async (done) => {
        done();
    });
    
});
