
import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({
    name: 'labelFromItem'
})

export class LabelFromItem implements PipeTransform {

    constructor() { }

    transform(value: any, list: SelectItem[]) {

        if (list === undefined) {
            return '';
        }
        if (value === undefined) {
            return '';
        }
        /*if (value == null) {
            return '';
        }
        if (list == null) {
            return '';
        }*/
        if (!isNaN(value)) {
            if (value !== 0) {
                value = value;
            }
        } else {
            value = value.trim();
        }

        if (list.find(item => item.value === value) === undefined) {
            return '';
        }
        return list.find(item => item.value === value).label;
    }
}
