export class SearchFilter {
  public limit: number;
  public offset: number;
  public select: any[];
  public relation: any[];
  public whereConditions: any;
  public orderBy: any;
  public count: boolean;
}
