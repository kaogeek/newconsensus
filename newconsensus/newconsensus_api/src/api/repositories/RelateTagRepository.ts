import { EntityRepository, Repository } from 'typeorm';
import { RelateTag } from '../models/RelateTag';

@EntityRepository(RelateTag)
export class RelateTagRepository extends Repository<RelateTag>  {

}
