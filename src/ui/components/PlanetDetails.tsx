import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Avatar, Box, Card, Flex, Subhead } from 'rebass';

const PlanetDetails = class PlanetDetails extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Unknown',
      units: 10,
      rate: 10,
    };
  }

  render() {
    return (
      <Card width={256} height={150} m="auto">
        <Flex>
          <Box width={1 / 3} mx="auto">
            <Avatar size={64} src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20" />
          </Box>
          <Box width={2 / 3}>
            <Subhead>{this.state.planetName}</Subhead>
            <div>Planet stats</div>
            <div>Units: {this.state.units}</div>
            <div>Rate: {this.state.rate}</div>
          </Box>
        </Flex>
      </Card>
    );
  }
};

export { PlanetDetails };
