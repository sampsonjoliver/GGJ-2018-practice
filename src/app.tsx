import * as React from 'react';
import * as ReactDom from 'react-dom';
import { when } from 'mobx';

import { PhaserStore } from 'stores/phaser';
import { GameStore } from 'stores/GameStore';
import { UiStore } from 'stores/ui';

const stores = {
  gameStore: new GameStore('001'),
  phaserStore: new PhaserStore(),
  uiStore: new UiStore(),
};

(window as any).stores = stores;

stores.phaserStore.initialise(window, 'phaser-container', stores.gameStore, stores.uiStore);

stores.gameStore.watchGame();

when(
  () => stores.phaserStore.phaser != null,
  () => {
    ReactDom.render(<p>Bruh.</p>, document.getElementById('react-container'));
  }
);
