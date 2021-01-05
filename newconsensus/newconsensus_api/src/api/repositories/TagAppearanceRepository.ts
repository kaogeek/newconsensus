import { EntityRepository, Repository } from 'typeorm';
import { TagAppearance } from '../models/TagAppearance';

@EntityRepository(TagAppearance)
export class TagAppearanceRepository extends Repository<TagAppearance>  {

}
