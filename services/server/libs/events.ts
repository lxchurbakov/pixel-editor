import _ from 'lodash';

export type AsyncListener<T, R = any> = (arg: T) => Promise<R>;
export type SyncListener<T, R = any> = (arg: T) => R;
export type Listener<T, R = any> = AsyncListener<T, R> | SyncListener<T, R>;

export class EventEmitter<T> {
    public listeners: Listener<T>[] = [];

    public on = (listener: Listener<T>) => {
        this.listeners.push(listener);

        return () => {
            this.listeners = _.filter(this.listeners, (l) => l !== listener);
        };
    }

    public emitsa = (data: T) => 
        this.listeners.reduce((acc, l) => acc.then(($data) => Promise.resolve(l($data))), Promise.resolve(data));

    public emitss = (data: T) => 
        this.listeners.reduce((acc, l) => l(acc), data);

    public emitpa = (data: T) => 
        Promise.all(this.listeners.map((l) => Promise.resolve(l(data))));

    public emitps = (data: T) => 
        this.listeners.map((l) => l(data));
};
