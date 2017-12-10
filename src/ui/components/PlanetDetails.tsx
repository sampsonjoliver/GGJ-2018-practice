import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node } from 'models';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

type PlanetDetailProps = {
  x: number;
  y: number;
  node: Node;
};

const PlanetDetails: React.StatelessComponent<PlanetDetailProps> = props => (
  <Paper elevation={4} style={{ position: 'absolute', padding: 8, left: props.x, top: props.y }}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Avatar src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20" />
      <Typography type="headline" component="h3">
        {props.node.id}
      </Typography>
    </div>
    <Divider style={{ margin: 16 }} />
    <Typography type="title">Name</Typography>
    <Typography type="subheading">{props.node.playerId}</Typography>
    <Typography type="title">Rate</Typography>
    <Typography type="subheading">{props.node.rate}</Typography>
    <Typography type="title">Units</Typography>
    <Typography type="subheading">{props.node.numUnits}</Typography>
  </Paper>
);

export { PlanetDetails };
