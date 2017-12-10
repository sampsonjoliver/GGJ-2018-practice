import { PhaserStore } from 'stores/phaser';
import { GameStore } from 'stores/GameStore';
import { UiStore } from 'stores/ui';

const gameStore = new GameStore('001');
const phaserStore = new PhaserStore();
const uiStore = new UiStore(gameStore);

export { gameStore, phaserStore, uiStore };
