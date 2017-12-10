import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, Toolbar } from 'rebass';

const Header: React.StatelessComponent<{}> = () => (
  <Provider>
    <Toolbar>Super secret sniper army base!</Toolbar>
  </Provider>
);

export { Header };
