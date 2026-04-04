import { MAT_DATE_FORMATS } from '@angular/material/core';

export interface ResultModel {
    isSuccess: boolean;
    message: string;
    data: any[];
}

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD-MM-YY',
    },
    display: {
        dateInput: 'DD-MM-YY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};