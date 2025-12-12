import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[numbersOnly]'
})
export class NumbersOnlyDirective {
    @HostListener('input', ['$event']) onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, '');
    }
}
