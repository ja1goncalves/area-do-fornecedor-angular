import { trigger, animate, style, group, query, stagger, transition, keyframes } from '@angular/animations';

export const fade = trigger('fade', [
    transition('void => *', [
        style({ opacity: '0' }),
        animate(1000, style({ opacity: '1' }))
    ]),
    transition('* => void', [
        style({ opacity: '1' }),
        animate(1000, style({ opacity: '0' }))
    ])
]);

export const collapse = trigger('collapse', [
    transition('void => *', [
        style({ height: '0' }),
        animate(300, style({ height: '*' }))
    ]),
    transition('* => void', [
        style({ height: '*' }),
        animate(300, style({ height: '0' }))
    ])
]);