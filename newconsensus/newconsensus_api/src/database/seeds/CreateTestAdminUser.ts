import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../api/models/User';
export class CreateTestAdminUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const user = new User();
        user.id = 1;
        user.username = 'test@parliament.go.th';
        user.password = await User.hashPassword('12345678');
        user.email = 'test@parliament.go.th';
        user.userGroupId = 1;
        return await em.save(user);
    }
}
