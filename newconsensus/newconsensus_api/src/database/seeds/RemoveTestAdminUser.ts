import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../api/models/User';
export class RemoveTestAdminUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const users: User[] = await em.find(User, { where: { username: 'test@parliament.go.th' } });

        for (const user of users) {
            await em.remove(user);
        }
    }
}
