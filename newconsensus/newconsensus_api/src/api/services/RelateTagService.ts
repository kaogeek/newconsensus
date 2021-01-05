import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { RelateTagRepository } from '../repositories/RelateTagRepository';
import { RelateTag } from '../models/RelateTag';
import { Between } from 'typeorm';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { TagAppearanceRepository } from '../repositories/TagAppearanceRepository';
import { ConfigService } from './ConfigService';
import { DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG, RELATETAG_TRENDING_SCORE_CONFIG_NAME } from '../../Constants';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';

@Service()
export class RelateTagService {
    constructor(@OrmRepository() private relateTagRepository: RelateTagRepository,
    @OrmRepository() private tagAppearanceRepository: TagAppearanceRepository,
    private configService: ConfigService, 
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create relateTag
    public async create(relateTag: any): Promise<any> {
        this.log.info('Create a new relateTag ');
        return this.relateTagRepository.save(relateTag);
    }

    // find one relateTag
    public findOne(relateTag: any): Promise<any> {
        return this.relateTagRepository.findOne(relateTag);
    }

    // find all relateTag
    public findAll(): Promise<any> {
        this.log.info('Find all relateTag');
        return this.relateTagRepository.find();
    }

    // edit relateTag
    public async edit(relateTag: RelateTag, newName?: string): Promise<any> {
        const oldRelateTag: string = relateTag.name;

        if(relateTag === null || relateTag === undefined) {
            return new Promise((resolve, reject) => {
                reject('relateTag is null');
            });
        }

        if(newName !== null && newName !== undefined) {
            const tagAppearances: any[] = await this.tagAppearanceRepository.find({
                where: {
                    tag: oldRelateTag,
                },
            });

            try {
                for (const item of tagAppearances) {
                    item.tag = newName;

                    await this.tagAppearanceRepository.update( {
                        tag: oldRelateTag,
                        contentId: item.contentId,
                    } , item);
                }
            } catch(error){
                Promise.reject(error);
            }

            relateTag.name = newName;
        }

        try {
            await this.relateTagRepository.update(oldRelateTag, relateTag);

            return new Promise((resolve, reject)=>{
                resolve({
                    name: relateTag.name,
                    trendingScore: relateTag.trendingScore,
                    result: true,
                });
            }).catch((error)=>{
                Promise.reject(error);
            });
        } catch(error){
            Promise.reject(error);
        }
    }

    public getRelateTag(name: string): Promise<any> {
        const condition = {
            name
        };
        return this.relateTagRepository.findOne(condition);
    }

    // relateTag List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.relateTagRepository.count(condition);
        } else {
            return this.relateTagRepository.find(condition);
        }
    }

    // delete relateTag
    public async delete(relateTag: any): Promise<any> {
        try {
            if(relateTag === null || relateTag === undefined) {
                return new Promise((resolve, reject) => {
                    reject('relateTag is null');
                });
            }
    
            const reTag: any = await this.relateTagRepository.findOne({
                where: {
                    name: relateTag.name,
                },
            });
    
            if(reTag !== null && reTag !== undefined) {
                await this.tagAppearanceRepository.delete({tag: reTag.name});
            } else {
                return new Promise((resolve, reject) => {
                    reject('relateTag find not found');
                });
            }
        } catch(error) {
            Promise.reject(error);
        }

        try {
            await this.relateTagRepository.delete(relateTag.name);

            return new Promise((resolve, reject)=>{
                resolve({
                    name: relateTag.name,
                    trendingScore: relateTag.trendingScore,
                    result: true,
                });
            }).catch((error)=>{
                Promise.reject(error);
            });

        } catch(error) {
            Promise.reject(error);
        }
    }

    public async updateTrendingScore(startDate: Date, endDate: Date): Promise<any> {
        try{
            const searchfilter: SearchFilter = new SearchFilter();

            let stmtObj = undefined;

            if (startDate && endDate) {
                stmtObj = {
                    createdDate: Between(startDate, endDate)
                };
            }

            if (stmtObj) {
                searchfilter.whereConditions = [stmtObj];
            }

            const relateTags = [];
            const findResult = await this.search(searchfilter.limit, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy, searchfilter.count);
            
            for (const item of findResult) { // find tags
                relateTags.push(item.name);
            }

            if(relateTags === undefined || relateTags === null || relateTags.length <= 0) {
                return Promise.resolve({});
            }

            // SELECT tag, count(tag), sum(count_appearance), max(created_date)
            // FROM test_NewConsensus.tag_appearance
            // where tag in ('tag1', 'tag2', 'tag3')
            // group by tag
            const query: any = await this.tagAppearanceRepository.createQueryBuilder('TagAppearance');
            query.select(['TagAppearance.tag as tag', 'COUNT(TagAppearance.tag) as relateTag', 'SUM(TagAppearance.count_appearance) as countAppearance', 'MAX(TagAppearance.created_date) as createdDate']);
            query.where('TagAppearance.tag IN (:...tags)', { tags: relateTags });
            query.groupBy('TagAppearance.tag');
            query.orderBy('TagAppearance.tag', 'ASC');

            const result = await query.getRawMany();

            const tagMap = {};

            for (const item of result) {
                const totalRelateTag = item.relateTag;
                const totalCountAppearance = item.countAppearance;
                const maxCreatedDate = item.createdDate;

                tagMap[item.tag] = {
                    totalRelateTag,
                    totalCountAppearance,
                    maxCreatedDate,
                };
            }

            const trendingScoreConfig = await this.getTrendingScoreConfig();

            // ([W + AX + BY ] as baseScore) * decay(t)
            // A = จำนวน. Tag ของ TagAppearance, B = จำนวน. CountAppearance ของ TagAppearance
            const w = trendingScoreConfig.weight;
            const x = trendingScoreConfig.weightX;
            const y = trendingScoreConfig.weightY;
            const maxFrac = trendingScoreConfig.maxFraction;

            const dateArray: Date[] = [];
            const baseScoreMap: any = {};

            for (const item of findResult) {
                const tagName = item.name;
                const tagAppearanceCreatedDate = item.createdDate;

                const a = (tagMap[tagName].totalRelateTag !== undefined) ? tagMap[tagName].totalRelateTag : 0;
                const b = (tagMap[tagName].totalCountAppearance !== undefined) ? tagMap[tagName].totalCountAppearance : 0;
                const baseScore = (w + (a * x) + (b * y));

                baseScoreMap[tagName] = baseScore;

                if (tagAppearanceCreatedDate) {
                    dateArray.push(item.createdDate);
                }
            }

            let functionM = trendingScoreConfig.functionM;

            let decayMap: any;
            if (trendingScoreConfig.function === 'linear') {
                if (functionM === undefined) {
                    functionM = DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.LINEAR_M;
                }
                decayMap = DecayFunctionUtil.generateLinearDecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
            } else if (trendingScoreConfig.function === 'f1') {
                if (functionM === undefined) {
                    functionM = DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.F1_M;
                }
                decayMap = DecayFunctionUtil.generateF1DecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
            } else {
                if (functionM === undefined) {
                    functionM = DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.EXPO_M;
                }
                decayMap = DecayFunctionUtil.generateExpoDecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
            }

            const relateTag: any = [];

            for (const item of findResult) {
                const tagName = item.name;
                const proposalCreated = item.createdDate.toISOString();
                const baseScore = baseScoreMap[tagName] ? baseScoreMap[tagName] : 0;
                const decayValue = decayMap[proposalCreated] ? decayMap[proposalCreated] : 0;
    
                // update trendingScore
                item.trendingScore = this.formatFraction((baseScore * decayValue), maxFrac);

                const updaetProposal = await this.edit(item);
    
                relateTag.push(updaetProposal);
            }

            return new Promise((resolve, reject) => {
                resolve(relateTag);
            });
        } catch(error) {
            return Promise.reject('Do not update TrendingScore');
        }
    }

    private getTrendingScoreConfig(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const functionNameConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.FUNCTION);
            let functionMConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.FUNCTION_M);
            const weightConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.WEIGHT);
            const weightXConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.WEIGHT_X);
            const weightYConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.WEIGHT_Y);
            let maxConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.SCORE_MAX_FRACTION);

            if (functionMConfig !== undefined) {
                functionMConfig = parseFloat(functionMConfig.value);
            }
            if (maxConfig !== undefined) {
                maxConfig = parseFloat(maxConfig.value);
            } else {
                maxConfig = DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.SCORE_MAX_FRACTION;
            }

            const result = {
                function: DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.FUNCTION,
                weight: DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.WEIGHT,
                weightX: DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.WEIGHT_X,
                weightY: DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.WEIGHT_Y,
                functionM: functionMConfig,
                maxFraction: maxConfig
            };

            if (functionNameConfig && functionNameConfig.value) {
                result.function = functionNameConfig.value;
            }
            if (weightConfig && weightConfig.value) {
                result.weight = parseFloat(weightConfig.value);
            }
            if (weightXConfig && weightXConfig.value) {
                result.weightX = parseFloat(weightXConfig.value);
            }
            if (weightYConfig && weightYConfig.value) {
                result.weightY = parseFloat(weightYConfig.value);
            }

            resolve(result);
        });
    }

    private formatFraction(value: number, maxFrac: number): number {
        if (value === undefined) {
            return value;
        }

        if (maxFrac === undefined) {
            return value;
        }

        const valueFormatString = value.toLocaleString('en-US', {
            minimumFractionDigits: maxFrac,
            maximumFractionDigits: maxFrac
        });

        try {
            return parseFloat(valueFormatString);
        } catch (error) { console.log(error); }

        return value;
    }
}
