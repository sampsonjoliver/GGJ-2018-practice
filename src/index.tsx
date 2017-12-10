import * as React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import { Provider } from "mobx-react";

import registerServiceWorker from "registerServiceWorker";

import * as stores from "stores";
import { App } from "ui/App";

(window as any).stores = stores;

stores.phaserStore.initialise(window, "phaser-container", stores.gameStore, stores.uiStore);

stores.gameStore.watchGame();

stores.tickStore.start();

ReactDOM.render(
  <Provider uiStore={stores.uiStore} phaserStore={stores.phaserStore}>
    <App />
  </Provider>,
  document.getElementById("react-container")
);
registerServiceWorker();
