import { observable, action } from "mobx";

import { GameStore } from "stores/GameStore";

export class TickStore {
  @observable isTicking: boolean = false;

  tickInterval: NodeJS.Timer;

  gameStore: GameStore;

  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;
  }

  @action
  start() {
    this.isTicking = true;
    this.tickInterval = setTimeout(() => {
      this.tick();
    }, 10000);
  }

  @action
  stop() {
    this.isTicking = false;
    clearTimeout(this.tickInterval);
  }

  @action
  private tick() {
    this.gameStore.game.tick = this.gameStore.game.tick + 1;
  }
}
