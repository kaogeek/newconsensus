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
import { Room } from 'src/api/models/Room';

describe('/api/room', () => {

    let pageUser: PageUser;
    let pageuserAuthorization: string;
    let settings: BootstrapSettings;
    let adminUser: User;
    let adminAuthorization: string;
    // room
    let room: Room;

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        room = {};
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
    test('POST: admin/ should create room by adminUser', async (done) => {
        done();
    });

    test('PUT: admin/:id/ should edit room by adminUser', async (done) => {
        done();
    });

    test('GET: admin/:id/ should get room by adminUser', async (done) => {
        done();
    });

    test('DELETE: admin/:id/ should delete room by adminUser', async (done) => {
        done();
    });

    // normaluser
    test('POST: / should NOT create room by normalUser', async (done) => {
        done();
    });

    test('PUT: /:id/ should NOT edit room by normalUser', async (done) => {
        done();
    });

    test('GET: admin/:id/ should get room by normalUser', async (done) => {
        done();
    });

    test('DELETE: /:id/ should NOT remove room by normalUser', async (done) => {
        done();
    });
});
