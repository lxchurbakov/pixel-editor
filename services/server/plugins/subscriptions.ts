import { v4 as uuidv4 } from 'uuid';

import { EventEmitter } from 'libs/events';

import WSS from 'plugins/websocket-server';

export type Message = any;
export type Id = string;
export type Subscription = { clientId: Id };

export default class Subscriptions {
    // This stuff won't work when multi instance - 
    // be sure to store this in redis as well as
    // share the create/message/destroy events 
    // through there
    private subscriptions = new Map<Id, Subscription>();

    private getSubscriptionIdByClientId = (clientId: Id) => {
        for (let [key, subscriiption] of this.subscriptions.entries()) {
            if (clientId === subscriiption.clientId) {
                return key;
            }
        }

        return null;
    };

    public onCreate = new EventEmitter<{ subscriptionId: Id }>();
    public onMessage = new EventEmitter<{ subscriptionId: Id, data: Message }>();
    public onDestroy = new EventEmitter<{ subscriptionId: Id }>();

    constructor (private wss: WSS) {
        this.wss.onMessage.on(({ clientId, data }) => {
            if (data?.type === 'subscribe') {
                const id = uuidv4();

                this.subscriptions.set(id, { clientId });
                this.onCreate.emitps({ subscriptionId: id });
            }
        });

        this.wss.onMessage.on(({ clientId, data }) => {
            if (data?.type === 'unsubscribe') {
                const { id } = data.data;

                for (let [key, subscription] of this.subscriptions.entries()) {
                    if (subscription.clientId === clientId && id === key) {
                        this.onDestroy.emitps({ subscriptionId: id });
                        this.subscriptions.delete(key);
                        break;
                    }
                }
            }
        });

        this.wss.onDisconnect.on(({ clientId }) => {
            for (let [key, subscription] of this.subscriptions.entries()) {
                if (subscription.clientId === clientId) {
                    this.subscriptions.delete(key);
                    this.subscriptions.delete(key);
                }
            }
        });

        this.wss.onMessage.on(({ clientId, data }) => {
            if (data?.type === 's/message') {
                const subscriptionId = this.getSubscriptionIdByClientId(clientId);

                if (subscriptionId) {
                    this.onMessage.emitps({ subscriptionId, data: data.data });
                }
            }
        });
    }

    public send = (subscriptionId: Id, data: Message) => {
        const subscription = this.subscriptions.get(subscriptionId);

        if (subscription?.clientId) {
            this.wss.send(subscription.clientId, { type: 's/message', data });
        }
    };

    public broadcast = (data: Message) => {
        for (let [, { clientId }] of this.subscriptions.entries()) {
            this.wss.send(clientId, { type: 's/message', data });
        }
    };
};
