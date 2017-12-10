import { firestore, mapDocToT } from 'service/firebase';
import { observable, action } from 'mobx';
import { Player, Transit, Node, Game } from 'models';
import { transaction } from 'mobx/lib/api/transaction';

export enum GameSize {
  small = 0.5,
  medium = 1,
  large = 2,
}
export enum Density {
  sparse = 20,
  regular = 50,
  dense = 100,
}
const CoordRangeMax = 1000;
const RateRangeMax = 10;
const PlayerStartingNodePercent = 0.05;
const NodeMaxSupportedUnitsFactor = 10;
const AttackerRatingFactor = 10;
const DefenderRatingFactor = 11;

export class GameStore {
  gameId: string;

  @observable game: Game = null;
  @observable nodes: Node[] = null;
  @observable players: Player[] = null;
  @observable ongoingTransits: Transit[] = null;
  @observable transitRequests: Transit[] = null;

  constructor(gameId: string) {
    this.gameId = gameId;
    this.watchGame();
  }

  get gameRef() {
    return firestore.collection('games').doc(this.gameId);
  }

  watchGame() {
    this.gameRef.onSnapshot(snapshot => {
      this.game = mapDocToT<Game>(snapshot);
    });

    this.gameRef.collection('nodes').onSnapshot(snapshot => {
      this.nodes = snapshot.docs.map(doc => mapDocToT<Node>(doc));
    });

    this.gameRef.collection('players').onSnapshot(snapshot => {
      this.players = snapshot.docs.map(doc => mapDocToT<Player>(doc));
    });

    this.gameRef
      .collection('transits')
      .where('isResolved', '==', false)
      .onSnapshot(snapshot => {
        this.ongoingTransits = snapshot.docs.map(doc => mapDocToT<Transit>(doc));
      });

    this.gameRef
      .collection('transits')
      .where('isPending', '==', true)
      .onSnapshot(snapshot => {
        this.transitRequests = snapshot.docs.map(doc => mapDocToT<Transit>(doc));
      });
  }

  @action
  createTransit(transit: Transit) {
    this.gameRef.collection('transits').add(transit);
  }

  @action
  createNode(node: Node) {
    this.gameRef.collection('nodes').add(node);
  }

  @action
  tick() {
    const currentTick = this.game.tick;
    const nextTick = currentTick + 1;

    // Do node productions
    this.nodes.forEach(node => {
      const maxSupportedUnits = node.rate * NodeMaxSupportedUnitsFactor;
      if (node.numUnits < maxSupportedUnits) {
        node.numUnits = Math.min(node.numUnits + node.rate, maxSupportedUnits);
      }
    });

    // Resolve ongoing transits
    const resolvedTransits = this.ongoingTransits.filter(transit => transit.arrivalTick <= nextTick);

    resolvedTransits.forEach(transit => {
      const to = this.nodes.find(obj => obj.id == transit.to);
      const from = this.nodes.find(obj => obj.id == transit.from);

      if (to.playerId !== transit.playerId) {
        const attackingPlayerCount = transit.numUnits;
        const defendingPlayerCount = to.numUnits;

        const attackingPlayerRating = attackingPlayerCount * AttackerRatingFactor;
        const defendingPlayerRating = defendingPlayerCount * DefenderRatingFactor;

        if (attackingPlayerRating > defendingPlayerRating) {
          to.playerId = transit.playerId;
          to.numUnits = attackingPlayerRating / AttackerRatingFactor;
        } else {
          to.playerId = to.playerId;
          to.numUnits = defendingPlayerRating / DefenderRatingFactor;
        }
      } else {
        to.playerId = transit.playerId;
      }
    });

    const batch = firestore.batch();

    // Update nodes
    this.nodes.forEach(node => {
      batch.update(this.gameRef.collection('nodes').doc(node.id), node);
    });

    // Update resolved transits
    resolvedTransits.forEach(transit => {
      batch.update(this.gameRef.collection('transits').doc(transit.id), {
        isResolved: true,
      });
    });

    // Kick off new transits
    this.transitRequests.forEach(transitRequest => {
      batch.update(this.gameRef.collection('transits').doc(transitRequest.id), {
        departureTime: nextTick,
        arrivalTime: nextTick + 1, // todo
        isPending: false,
      });
    });

    // Update game tick
    this.gameRef.update({ tick: nextTick });

    batch.commit();
  }
}

async function generateGame(size: GameSize, density: Density, playerIds: string[]) {
  const numNodes: number = size.valueOf() * density.valueOf();
  const rangeMax = CoordRangeMax * size.valueOf();
  const numPlayers = playerIds.length;
  const numPlayerNodes = Math.max(1, numNodes * PlayerStartingNodePercent);

  const nodes: Node[] = [];
  for (let index = 0; index < numNodes; index++) {
    const node: Node = {
      playerId: '',
      coordinates: {
        x: Math.random() * rangeMax,
        y: Math.random() * rangeMax,
      },
      numUnits: 0,
      rate: Math.random() * RateRangeMax + 1,
    };
    nodes.push(node);
  }

  for (let pindex = 0; pindex < numPlayers; pindex++) {
    const player = playerIds[pindex];
    for (let index = 0; index < numPlayerNodes; index++) {
      nodes[pindex * numPlayerNodes + index].playerId = player;
      nodes[pindex * numPlayerNodes + index].numUnits = 10;
    }
  }

  const game = await firestore.collection('games').add({ tickCount: 0 });

  nodes.forEach(node => {
    game.collection('nodes').add(node);
  });
}
