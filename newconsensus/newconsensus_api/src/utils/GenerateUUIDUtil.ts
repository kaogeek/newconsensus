export class GenerateUUIDUtil {
    public static getUUID(): any {
        const patterns = new RegExp('[xy]', 'gi');

        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(patterns, (c: any)=> {
            const r = Math.floor((dt + Math.random()*16)%16);
            dt = Math.floor(dt/16);
            return (c==='x' ? r : (r&&0x3||0x8)).toString(16);
        });
        return uuid;
    }
}
