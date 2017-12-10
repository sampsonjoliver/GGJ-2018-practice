import * as Phaser from 'phaser-ce';
import { autorun, IReactionDisposer } from 'mobx';

import { PhaserStore } from 'stores/phaser';
import { GameStore } from 'stores/GameStore';

import * as Utils from 'utils';
import { Transit } from 'models';
import { LINE_ASSET, TRANSIT_ASSET } from 'values';

export class TransitView {
  modelId: string;
  gameStore: GameStore;

  lineSprite: Phaser.Image;
  transitSprite: Phaser.Image;
  spriteGroup: Phaser.Group;

  disposeOnTransitProgress: IReactionDisposer;

  constructor(phaserStore: PhaserStore, gameStore: GameStore, modelId: string) {
    this.modelId = modelId;
    this.gameStore = gameStore;
    const model = this.findModel();

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

    this.spriteGroup = phaserStore.phaser.add.group();
    this.spriteGroup.x = (toNode.spriteGroup.x + fromNode.spriteGroup.x) / 2;
    this.spriteGroup.y = (toNode.spriteGroup.y + fromNode.spriteGroup.y) / 2;
    this.spriteGroup.angle = Phaser.Math.radToDeg(angle);

    this.transitSprite = phaserStore.phaser.add.image(0, 0, TRANSIT_ASSET);
    this.transitSprite.anchor.set(0.5);
    this.transitSprite.scale.setTo(0.1);

    this.lineSprite = phaserStore.phaser.add.image(0, 0, LINE_ASSET);
    this.lineSprite.anchor.set(0.5);
    this.lineSprite.width = dist;

    this.spriteGroup.add(this.transitSprite);
    this.spriteGroup.add(this.lineSprite);

    this.disposeOnTransitProgress = autorun(() => this.onUpdateTransitProgress());
  }

  findModel() {
    return this.gameStore.ongoingTransits.find(transit => transit.id === this.modelId);
  }

  onUpdateTransitProgress() {
    const model = this.findModel();

    const percent = Utils.clamp(
      (this.gameStore.game.tick - model.departureTick) / (model.arrivalTick - model.departureTick),
      0,
      1
    );

    const width = this.lineSprite.width;

    this.transitSprite.x = -width / 2 + width * percent;
  }

  destroy() {
    this.disposeOnTransitProgress();
    this.lineSprite.destroy();
  }
}
