import React from 'react';
import { createRoot } from 'react-dom/client';

import Page from './page';

const app = document.getElementById('app');

if (!app) {
    throw new Error(`#app not found`);
}

const root = createRoot(app);

root.render(<Page />);
