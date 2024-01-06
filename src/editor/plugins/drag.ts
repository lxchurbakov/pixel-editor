import Canvas from './canvas';
import Events from './events';
import Modes from './modes';
import { EventEmitter } from '/src/libs/events';

const SPACE = 32;

const limit = (value, min, max) => Math.max(min, Math.min(max, value));

export default class {
    private oldmode = null;
    private translate = { x: 0, y: 0 };
    private scale = 1;

    public onRender = new EventEmitter<any>();

    public screenToCanvas = (p) => ({
        x: p.x / this.scale - this.translate.x,
        y: p.y / this.scale - this.translate.y,
    });

    constructor (private canvas: Canvas, private events: Events, private modes: Modes) {
        this.events.onKeyDown.subscribe((code) => {
            if (code === SPACE) {
                this.oldmode = this.modes.get();
                this.modes.set('drag');
            }
        });

        this.events.onKeyUp.subscribe((code) => {
            if (code === SPACE) {
                if (this.modes.get() === 'drag' && this.oldmode && this.oldmode !== 'drag') {
                    this.modes.set(this.oldmode);
                    this.oldmode = null;
                }                
            }
        });

        this.canvas.onRender.subscribe((context) => {
            context.save();
            // context.translate(1284 / 2, 907 / 2)
            context.scale(this.scale, this.scale);
            context.translate(this.translate.x, this.translate.y);
            
            this.onRender.emitParallelSync(context);

            context.restore();
        });

        this.events.onDrag.subscribe((offset) => {
            if (this.modes.get() === 'drag') {
                this.translate.x += offset.x / this.scale;
                this.translate.y += offset.y / this.scale;
            }
        });

        this.events.onZoom.subscribe(({ x, y, position }) => {
            const delta = y / 1000;
            const old = this.scale;

            this.scale = limit(this.scale + delta, .2, 5);
            const change = this.scale - old;

            this.translate.x -= change * (position.x / (old * this.scale));
            this.translate.y -= change * (position.y / (old * this.scale));
        });
    }
};
