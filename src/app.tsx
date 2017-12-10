import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import { App } from './ui/App';
import { PhaserStore } from 'stores/phaser';
import { GameStore } from 'stores/GameStore';
import { UiStore } from 'stores/ui';

injectGlobal`
  * { box-sizing: border-box; }
  body { margin: 0; }
`;

const stores = {
  gameStore: new GameStore('001'),
  phaserStore: new PhaserStore(),
  uiStore: new UiStore(),
};

(window as any).stores = stores;

stores.phaserStore.initialise(window, 'phaser-container', stores.gameStore, stores.uiStore);

stores.gameStore.watchGame();

ReactDOM.render(<App />, document.getElementById('react-container'));
