import { autorun } from 'mobx';
import * as Phaser from 'phaser-ce';

import { GameStore } from 'stores/GameStore';
import { PhaserStore } from 'stores/phaser';
import { UiStore } from 'stores/ui';
import { NODE_ASSET, NODE_VISIBILITY_OVERLAY_ALPHA } from 'values';

import { Node } from 'models';

export class NodeView {
  modelId: string;
  gameStore: GameStore;
  phaserStore: PhaserStore;
  uiStore: UiStore;

  sprite: Phaser.Image;
  spriteBackdrop: Phaser.Image;
  spriteOverlay: Phaser.Image;
  spriteGroup: Phaser.Group;

  constructor(phaserStore: PhaserStore, gameStore: GameStore, uiStore: UiStore, modelId: string) {
    this.modelId = modelId;
    this.phaserStore = phaserStore;
    this.gameStore = gameStore;
    this.uiStore = uiStore;

    this.initialiseSprites();
    this.initialiseSpriteEvents();
    this.initialiseAutoruns();
  }

  findModel(): Node {
    return this.gameStore.nodes.find(node => node.id === this.modelId);
  }

  initialiseSprites() {
    this.spriteGroup = this.phaserStore.phaser.add.group();

    this.sprite = new Phaser.Image(this.phaserStore.phaser, 0, 0, NODE_ASSET);
    this.sprite.anchor.set(0.5);

    this.spriteBackdrop = new Phaser.Image(this.phaserStore.phaser, 0, 0, NODE_ASSET);
    this.spriteBackdrop.scale.setTo(1.05);
    this.spriteBackdrop.anchor.set(0.5);

    this.spriteOverlay = new Phaser.Image(this.phaserStore.phaser, 0, 0, NODE_ASSET);
    this.spriteOverlay.scale.setTo(1.05);
    this.spriteOverlay.anchor.set(0.5);
    this.spriteOverlay.tint = 0x555555;
    this.spriteOverlay.alpha = 0;

    this.spriteGroup.add(this.spriteBackdrop);
    this.spriteGroup.add(this.sprite);
    this.spriteGroup.add(this.spriteOverlay);
  }

  initialiseSpriteEvents() {
    this.sprite.inputEnabled = true;
    this.sprite.input.pixelPerfectOver = true;
    this.sprite.input.enabled = true;

    const self = this;
    this.sprite.events.onInputUp.add((obj: Phaser.Image, pointer: Phaser.Pointer) => {
      self.uiStore.onClickNode(self.modelId);
    });
  }

  initialiseAutoruns() {
    autorun(this.onUpdateTerritorySprite.bind(this));
  }

  onUpdateTerritorySprite() {
    const model = this.findModel();
    this.sprite.loadTexture(NODE_ASSET);
    this.spriteGroup.x = model.coordinates.x;
    this.spriteGroup.y = model.coordinates.y;
  }
}
