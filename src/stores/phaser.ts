import { observable, action, computed, when, autorun } from 'mobx';
import * as Phaser from 'phaser-ce';

import { GameStore } from 'stores/GameStore';
import { UiStore } from 'stores/ui';
import { NodeView } from 'phaser/node';
import { TransitView } from 'phaser/transit';
import { KineticScroller } from 'phaser/kineticScroller';

import * as Utils from 'utils';

import { ASSET_PATH } from 'values';

export class PhaserStore {
  @observable.ref phaser: Phaser.Game = null;

  nodeViews: Map<string, NodeView> = new Map();
  transitViews: Map<string, TransitView> = new Map();

  cameraTween: Phaser.Tween;

  gameStore: GameStore;
  uiStore: UiStore;

  @action
  setPhaser(phaser: Phaser.Game) {
    this.phaser = phaser;
  }

  @action
  initialise(window: Window, divId: string, gameStore: GameStore, uiStore: UiStore) {
    this.gameStore = gameStore;
    this.uiStore = uiStore;

    this.initialisePhaser(window, divId);

    when(
      () => this.gameStore.nodes !== null && this.phaser != null,
      () => {
        const kineticScroller = new KineticScroller(this);
        this.phaser.world.add(kineticScroller.sprite);

        for (const node of this.gameStore.nodes) {
          this.nodeViews.set(node.id, new NodeView(this, this.gameStore, this.uiStore, node.id));
        }

        autorun(() => this.initialiseTransitViews());

        this.centreCamera();
      }
    );
  }

  @action
  centreCamera(): Promise<{}> {
    if (this.gameStore.nodes.length == 0) throw new Error('No nodes exist, cannot centre camera!');
    return this.focusOn(this.gameStore.nodes.map(node => node.id));
  }

  @action
  focusOn(ids: string[]): Promise<{}> {
    if (ids.length == 0) {
      this.centreCamera();
      return;
    }

    const positions: Phaser.Point[] = [];
    ids.forEach(id => {
      positions.push(this.nodeViews.get(id).spriteGroup.position);
    });

    const x = Utils.sum(positions.map(position => position.x)) / positions.length;
    const y = Utils.sum(positions.map(position => position.y)) / positions.length;

    return this.tweenCamera(x, y);
  }

  @action
  tweenCamera(x: number, y: number): Promise<{}> {
    if (this.cameraTween) {
      this.cameraTween.stop();
    }
    const promise = new Promise((resolve, reject) => {
      const centreX = x - this.phaser.camera.width / 2;
      const centreY = y - this.phaser.camera.height / 2;
      this.cameraTween = this.phaser.add
        .tween(this.phaser.camera)
        .to({ x: centreX, y: centreY }, 500, Phaser.Easing.Quadratic.Out);
      this.cameraTween.onComplete.add(() => {
        this.cameraTween = null;
        resolve();
      });
      this.cameraTween.start();
    });
    return promise;
  }

  @action
  setCamera(x: number, y: number) {
    if (this.cameraTween) {
      this.cameraTween.stop();
      this.cameraTween = null;
    }
    this.phaser.camera.x = x - this.phaser.camera.width / 2;
    this.phaser.camera.y = y - this.phaser.camera.height / 2;
  }

  @action
  private initialisePhaser(window: Window, divId: string) {
    const self = this;

    const phaser = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, divId, {
      preload,
      create,
      update,
    });

    window.onresize = () => {
      let width = window.innerWidth;
      let height = window.innerHeight;
      phaser.width = width;
      phaser.height = height;
      phaser.stage.getBounds().width = width;
      phaser.stage.getBounds().height = height;
      if (phaser.renderType === Phaser.WEBGL) {
        phaser.renderer.resize(width, height);
      }
    };

    function preload() {
      phaser.load.image('line', ASSET_PATH + 'line.png');
      phaser.load.image('planet', ASSET_PATH + 'planet.png');
      phaser.load.image('circle', ASSET_PATH + 'circle.png');
    }

    function create() {
      phaser.stage.backgroundColor = 0x000000;
      phaser.stage.disableVisibilityChange = true;
      phaser.camera.bounds = null;

      self.setPhaser(phaser);
    }

    function update() {}
  }

  private initialiseTransitViews() {
    this.transitViews.forEach((unitView: TransitView, transitId: string) => {
      if (!this.gameStore.ongoingTransits.some(transit => transit.id === transitId)) {
        this.transitViews.delete(unitView.modelId);
        unitView.destroy();
      }
    });

    if (this.gameStore.ongoingTransits) {
      this.gameStore.ongoingTransits.forEach(transit => {
        const transitView = this.transitViews.get(transit.id);
        if (!transitView) {
          this.transitViews.set(transit.id, new TransitView(this, this.gameStore, transit.id));
        }
      });
    }
  }
}
