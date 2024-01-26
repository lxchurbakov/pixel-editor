import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { EventEmitter } from 'libs/events';

import Entrypoint from 'plugins/entrypoint';

// const WS_PORT = Number(process.env.WS_PORT);

// if (!WS_PORT) {
//     throw new Error(`WS_PORT (port for websocket server) is not set`);
// }

export type WebSocket = any;

// Another plugin to provide frontend application with
// yet another way of communication - websocket

export default class {
    // private wss = new WebSocketServer({ port: WS_PORT });
    private wss: WebSocketServer;
    private clients = new Map<string, WebSocket>();

    public onMessage = new EventEmitter<{ clientId: string, data: any }>();
    public onConnect = new EventEmitter<{ clientId: string }>();
    public onDisconnect = new EventEmitter<{ clientId: string }>();

    constructor (private entrypoint: Entrypoint) {
        this.wss = new WebSocketServer({ server: this.entrypoint.server });

        // this.wss.on('ready', () => {
        //     console.log('WS Server is up at 90001');
        // });

        this.wss.on('connection', (ws: WebSocket) => {
            const clientId = uuidv4();

            this.clients.set(clientId, ws);

            ws.on('close', () => {
                this.clients.delete(clientId);
                this.onDisconnect.emitps({ clientId });
            });

            ws.on('message', (data) => {
                this.onMessage.emitps({ clientId, data: JSON.parse(data) });
            });

            this.onConnect.emitps({ clientId });
        });

        this.onConnect.on(({ clientId }) => {
            this.send(clientId, 'Hi fella');
        });
    }

    public send = (clientId: string, data: any) => {
        const ws = this.clients.get(clientId);

        if (!ws) {
            throw new Error(`Cannot send data to ${clientId}`);
        }

        ws.send(JSON.stringify(data));
    };

    public broadcast = (data: any) => {
        this.clients.forEach((ws) => {
            ws.send(JSON.stringify(data));
        });
    };
};