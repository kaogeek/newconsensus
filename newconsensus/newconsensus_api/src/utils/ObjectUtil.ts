/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
export class ObjectUtil {

    public static createNewObjectWithField(sourceObject: any, keys?: string[]): any {
        let result = {};

        if (keys !== undefined) {
            for (const key of keys) {
                result[key] = sourceObject[key];
            }
        } else {
            result = JSON.parse(JSON.stringify(sourceObject));
        }

        return result;
    }

}
