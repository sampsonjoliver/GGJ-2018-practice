import { Node } from 'models';
import { action } from 'mobx';
import { observable } from 'mobx';
import { GameStore } from 'stores/GameStore';

export class UiStore {
  gameStore: GameStore;

  @observable selectedNode?: Node;

  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;
  }

  @action
  onClickNode(nodeId: string) {
    this.selectedNode = this.gameStore.nodes.find(obj => obj.id === nodeId);
  }
}
