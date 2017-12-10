import { PhaserStore } from "stores/phaser";
import { GameStore } from "stores/GameStore";
import { UiStore } from "stores/ui";
import { TickStore } from "stores/tick";

const gameStore = new GameStore("001");
const phaserStore = new PhaserStore();
const uiStore = new UiStore(gameStore);
const tickStore = new TickStore(gameStore);

export { gameStore, phaserStore, uiStore, tickStore };
