import Canvas from './canvas';
import Events from './events';
import Modes from './modes';

import Drag from './drag';

const GRID_SIZE = 10;

export type Point = { x: number; y: number; };

const match = (a: Point, b: Point) => {
    return a.x === b.x && a.y === b.y;
};

export default class {
    private color = '#ff0000';
    private pixels = [];

    private findIndexByPosition = (position) => {
        return this.pixels.findIndex((p) => match(p.position, position));
    };
    
    private cleanupPixels = () => {
        this.pixels = this.pixels.reverse().filter((p, $index) => {
            const index = this.findIndexByPosition(p.position);

            return index === $index;
        });
    };

    constructor (private events: Events, private modes: Modes, private drag: Drag) {
        this.drag.onRender.subscribe((context) => {
            this.pixels.forEach(({ position, color }) => {
                context.fillStyle = color;
                context.beginPath();
                context.fillRect(position.x * GRID_SIZE, position.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            });
        });

        let down = false;

        this.events.onMouseDown.subscribe(($position) => {
            if (this.modes.get() === 'draw') {
                down = true;

                const position = this.drag.screenToCanvas($position);
                const x = Math.floor(position.x / GRID_SIZE);
                const y = Math.floor(position.y / GRID_SIZE);

                this.paintPixel({ x, y });
            }
        });

        let last = null;

        this.events.onMouseMove.subscribe(($position) => {
            if (!down) {
                return;
            }

            const position = this.drag.screenToCanvas($position);

            const x = Math.floor(position.x / GRID_SIZE);
            const y = Math.floor(position.y / GRID_SIZE);

            const current = { x, y };

            if (last !== null) {
                const diff = Math.max(Math.abs(current.x - last.x), Math.abs(current.y - last.y));

                for (let i = 0; i < diff; ++i) {
                    const position = {
                        x: Math.round(((current.x - last.x) / diff) * i) + last.x,
                        y: Math.round(((current.y - last.y) / diff) * i) + last.y,
                    };

                    this.paintPixel(position);
                }
            } else {
                this.paintPixel(current);
            }   
            
            last = current;
        });

        this.events.onMouseUp.subscribe(() => {
            down = false;
            last = null;
            this.cleanupPixels();
        });
    }

    public paintPixel = (position) => {
        if (this.color === null) {
            this.pixels = this.pixels.filter(($) => !match($.position, position));
        } else {
            this.pixels.push({ position, color: this.color });
        }
    };

    public setColor = (color: string) => {
        this.color = color;
    };
};
