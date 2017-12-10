import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, Flex, Box } from 'rebass';

import { PlanetDetails } from 'ui/components/PlanetDetails';
import { Header } from 'ui/components/Header';

const App: React.StatelessComponent<{}> = ({ children, ...props }) => (
  <Provider>
    <Header />
    <Flex mx={-2}>
      <Box width={1 / 3}>
        {/* {phaserStore.stores != null ? <div>Phaser is not null</div> : <div>Phaser is null</div>} */}
      </Box>
      <Box width={1 / 3} />
      <Box width={1 / 3}>
        <PlanetDetails />
      </Box>
    </Flex>
  </Provider>
);

export { App };
