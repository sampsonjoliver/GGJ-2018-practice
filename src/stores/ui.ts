import { Node } from 'models';
import { action } from 'mobx';
import { observable } from 'mobx';
import { GameStore } from 'stores/GameStore';
import { PhaserStore } from 'stores/phaser';

export class UiStore {
  gameStore: GameStore;
  phaserStore: PhaserStore;

  @observable selectedNode?: Node;

  constructor(gameStore: GameStore, phaserStore: PhaserStore) {
    this.gameStore = gameStore;
    this.phaserStore = phaserStore;
  }

  @action
  onClickNode(nodeId: string) {
    this.selectedNode = this.gameStore.nodes.find(obj => obj.id === nodeId);
  }
}
