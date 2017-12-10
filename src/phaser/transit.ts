import * as Phaser from 'phaser-ce';
import { PhaserStore } from 'stores/phaser';
import { GameStore } from 'stores/GameStore';

import * as Utils from 'utils';
import { Transit } from 'models';
import { LINE_ASSET } from 'values';

export class TransitView {
  modelId: string;
  sprite: Phaser.Image;

  constructor(phaserStore: PhaserStore, gameStore: GameStore, modelId: string) {
    this.modelId = modelId;

    const model = gameStore.ongoingTransits.find(transit => transit.id === modelId);

    const toNode = phaserStore.nodeViews.get(model.to);
    const fromNode = phaserStore.nodeViews.get(model.from);

    const angle = Phaser.Math.angleBetween(
      toNode.spriteGroup.x,
      toNode.spriteGroup.y,
      fromNode.spriteGroup.x,
      fromNode.spriteGroup.y
    );
    const dist = Phaser.Math.distance(
      toNode.spriteGroup.x,
      toNode.spriteGroup.y,
      fromNode.spriteGroup.x,
      fromNode.spriteGroup.y
    );

    this.sprite = phaserStore.phaser.add.image(
      (toNode.spriteGroup.x + fromNode.spriteGroup.x) / 2,
      (toNode.spriteGroup.y + fromNode.spriteGroup.y) / 2,
      LINE_ASSET
    );
    this.sprite.anchor.set(0.5);
    this.sprite.width = dist;
    this.sprite.angle = Phaser.Math.radToDeg(angle);
    this.sprite.sendToBack();
  }

  destroy() {
    this.sprite.destroy();
  }
}
