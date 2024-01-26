import { config } from 'dotenv';
  
config();

import Entrypoint from 'plugins/entrypoint';
import WebSocketServer from 'plugins/websocket-server';

// import Channel from './plugins/core/channel';
// import Session from './plugins/core/session';

// import Example101 from './plugins/examples/101';
// import Example102 from './plugins/examples/102';
// import Example103 from './plugins/examples/103';
// import Example105 from './plugins/examples/105';

const entrypoint = new Entrypoint();
const wss = new WebSocketServer(entrypoint);

// const channel = new Channel(wss);
// const session = new Session(entrypoint);

// const example101 = new Example101(entrypoint);
// const example102 = new Example102(channel);
// const example103 = new Example103(entrypoint, channel);

// const example105 = new Example105(channel);

entrypoint.start();