import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { UserGroup } from '../../api/models/UserGroup';
export class UserGroupData implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const user = new UserGroup();
        user.groupId = 1;
        user.name = 'admin';
        return em.save(user);
    }
}
