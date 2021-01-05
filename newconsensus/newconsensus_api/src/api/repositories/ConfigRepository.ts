import { EntityRepository, Repository } from 'typeorm';
import { Config } from '../models/Config';

@EntityRepository(Config)
export class ConfigRepository extends Repository<Config>  {

}
