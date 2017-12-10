import { firestore, mapDocToT } from 'service/firebase';
import { observable, action } from 'mobx';
import { Transit, Node } from 'models';

export class GameStore {
  @observable nodes: Node[] = null;
  @observable transits: Transit[] = null;

  constructor() {}

  watchGame(gameId: string) {
    firestore
      .collection('games')
      .doc(gameId)
      .collection('nodes')
      .onSnapshot(snapshot => {
        this.nodes = snapshot.docs.map(doc => mapDocToT<Node>(doc));
      });

    firestore
      .collection('games')
      .doc(gameId)
      .collection('transits')
      .onSnapshot(snapshot => {
        this.transits = snapshot.docs.map(doc => mapDocToT<Transit>(doc));
      });
  }
}
