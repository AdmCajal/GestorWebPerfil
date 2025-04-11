import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sixDigit'
})
export class SixDigitPipe implements PipeTransform {

  transform(value: number): string {
    const paddedValue = value.toString().padStart(6, '0');
    return paddedValue;
  }
  

}
