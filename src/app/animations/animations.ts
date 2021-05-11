import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const Animations = [

    trigger('fade', [
        state('in', style({ opacity: 1 })),
        transition('out => in', [style({ opacity: 0 }), animate(300)]),
        transition('in => out', animate(300, style({ opacity: 0 })))
    ])
];
