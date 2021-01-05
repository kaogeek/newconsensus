import { Service } from 'typedi';
import * as badwords from '../json/badwords.json';

@Service()
export class BadWordService {

    private badWordList: any[] = [];
    private placeHolder = '*';
    private fix = '#@#';
    private space = '&nbsp;';
    private spaceReg = '@@@';

    public load(badWordList: string[]): void {
        if (badWordList === undefined || badWordList === null) {
            badWordList = [];
        }

        this.badWordList = badWordList;
    }

    public reloadWordList(): void {
        this.badWordList = badwords.list;
    }

    public addWord(word: string): void {
        if (this.badWordList === undefined || this.badWordList === null) {
            this.badWordList = [];
        }

        this.badWordList.push(word);
    }

    public removeWord(word: string): void {
        if (this.badWordList === undefined || this.badWordList === null) {
            this.badWordList = [];
        }

        const index = this.badWordList.indexOf(word);
        if (index >= 0) {
            this.badWordList = this.badWordList.splice(index, 1);
        }
    }

    public setPlaceHolder(placeHolder: string): void {
        if (placeHolder) {
            this.placeHolder = placeHolder;
        }
    }

    public clean(text: string, placeHolder?: string): string {
        if (text === undefined || text === null || text === '') {
            return text;
        }

        if (placeHolder === undefined || placeHolder === null) {
            placeHolder = this.placeHolder;
        }

        this.reloadWordList();

        if(text === undefined || text === null || text === ''){
            return text;
          }
      
          text = text.trim();
      
          const patterns = new RegExp(this.space, 'gi');
          text = text.replace(patterns, this.spaceReg);
      
          for (let n = 0; n < this.badWordList.length; n++) {
      
              const badTxt: string = Object.keys(this.badWordList[n])[0];
          
              if (this.badWordList[n][badTxt] !== undefined && this.badWordList[n][badTxt].length > 0) {
                  let fixPosition: string;
                  
                  [...this.badWordList[n][badTxt]].forEach(c => {
                      fixPosition += this.fix;
                      text = text.replace(c, fixPosition);
                  });
              }
      
              const firstTxt: string = badTxt.charAt(0);
              const lastTxt = badTxt.charAt(badTxt.length - 1);
          
              let txt = '';
              let midCount = 0;

              if(badTxt.length > 2) {
                [...badTxt].forEach((c, i) => {
                    if (i > 0 && i < badTxt.length - 1) {
                        txt += c + '';
                        midCount++;
                    } 
                });
              }
          
              const midTxt: string = (txt === undefined ? '' : txt.substring(0, txt.length));
              
              const regTxt = '[' + firstTxt + '][\s*\.*]*(' + midTxt + '){'+midCount+'}[\s*\.*]*[' + lastTxt + ']';

              const pattern = new RegExp(regTxt, 'gi');
              text = text.replace(pattern, '*');

              if (this.badWordList[n][badTxt] !== undefined && this.badWordList[n][badTxt].length > 0) {
                  let fixPosition: string;
      
                  [...this.badWordList[n][badTxt]].forEach(c => {
                      fixPosition += this.fix;
                      text = text.replace(fixPosition, c);
                  });
              }
          }
      
          const patternss = new RegExp(this.spaceReg, 'gi');
          text = text.replace(patternss, this.space);
          
        return text;
    }
}
