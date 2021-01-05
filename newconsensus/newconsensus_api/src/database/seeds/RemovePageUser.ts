import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { PageUser } from '../../api/models/PageUser';
export class RemovePageUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const pageUsers: PageUser[] = await em.find(PageUser, { where: { username: 'bruce@spurtcart.com' } });

        for (const user of pageUsers) {
            await em.remove(user);
        }
    }
}
