import { EntityRepository, Repository } from 'typeorm';
import { Partner } from '../models/Partner';

@EntityRepository(Partner)
export class PartnerRepository extends Repository<Partner>  {

}
