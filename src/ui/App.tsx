import { PhaserStore } from '../stores/phaser';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { inject, observer } from 'mobx-react';
import { PlanetDetails } from 'ui/components/PlanetDetails';
import { Header } from 'ui/components/Header';
import { UiStore } from 'stores/ui';

const theme = createMuiTheme({});

type AppProps = {
  uiStore?: UiStore;
  phaserStore?: PhaserStore;
};

type AppInjectedProps = {
  uiStore: UiStore;
  phaserStore: PhaserStore;
};

const AppComponent: React.StatelessComponent<AppProps> = ({ children, ...props }) => {
  const injected = props as AppInjectedProps;
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      {injected.uiStore.selectedNode && <PlanetDetails x={10} y={10} node={injected.uiStore.selectedNode} />}
    </MuiThemeProvider>
  );
};

export const App = inject('uiStore')(observer(AppComponent));
