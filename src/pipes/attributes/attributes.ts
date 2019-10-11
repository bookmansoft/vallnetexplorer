import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert Object to Json, others toString().
 */
@Pipe({
  name: 'attributes'
})
export class AttributesPipe implements PipeTransform {

  transform(value: any): string {
    if(typeof(value)==='object'){
        return JSON.stringify(value);
    }
    else{
        return value.toString();
    }
  }
}