import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const Header: React.StatelessComponent<{}> = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography type="title" color="inherit">
        Nottunes Pride
      </Typography>
    </Toolbar>
  </AppBar>
);

export { Header };
