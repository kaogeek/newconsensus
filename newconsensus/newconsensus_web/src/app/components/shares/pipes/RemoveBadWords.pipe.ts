import { Pipe, PipeTransform } from '@angular/core';
import { BadWordUtils } from '../../../utils/BadWordUtils';

@Pipe({
  name: 'removeBadWords'
})

export class RemoveBadWords implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value === undefined || value === null || value === '' || typeof value !== 'string') {
      return value;
    }

    return BadWordUtils.clean(value);
  }
}
