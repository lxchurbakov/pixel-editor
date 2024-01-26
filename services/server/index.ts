import { config } from 'dotenv';
  
config();

import Entrypoint from 'plugins/entrypoint';
import WebSocketServer from 'plugins/websocket-server';
import Subscriptions from 'plugins/subscriptions';

const entrypoint = new Entrypoint();
const wss = new WebSocketServer(entrypoint);
const subscriptions = new Subscriptions(wss);

entrypoint.start();