import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node } from 'models';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';

type PlanetDetailProps = {
  x: number;
  y: number;
  node: Node;
};

const PlanetDetails: React.StatelessComponent<PlanetDetailProps> = props => (
  <Paper>
    <Avatar src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20" />
    <Typography>{props.node.id}</Typography>
    <Typography>{props.node.playerId}</Typography>
    <Typography>{props.node.rate}</Typography>
    <Typography>{props.node.numUnits}</Typography>
  </Paper>
);

export { PlanetDetails };
