import { EventEmitter } from 'libs/events';

import { Drag } from '@styled-icons/fluentui-system-filled/Drag';
import { Paint } from '@styled-icons/boxicons-regular/Paint';

export const MODES = [
    { name: 'move', icon: Drag },
    { name: 'draw', icon: Paint },
];

export default class Modes {
    public mode = 'draw';

    public get = () => {
        return this.mode;
    };

    public set = ($) => {
        this.mode = $;
        this.onUpdate.emitParallelSync($);
    };

    public onUpdate = new EventEmitter<string>();
    public modes = MODES;
};
