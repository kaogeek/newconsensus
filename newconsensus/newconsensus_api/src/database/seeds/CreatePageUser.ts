import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { PageUser } from '../../api/models/PageUser';
export class CreatePageUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const user = new PageUser();
        user.id = 1;
        user.username = 'bruce@spurtcart.com';
        user.password = await PageUser.hashPassword('1234');
        user.email = 'bruce@spurtcart.com';
        return await em.save(user);
    }
}
