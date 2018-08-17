import React from 'react';
import { compose, withState } from 'recompose';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import RateReviewIcon from '@material-ui/icons/RateReview';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CandidatesContainer from '../content/ListCandidates/Container/CandidatesContainer';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';


const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 3}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
    textAlign: 'center'
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 500,
  },
})

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#f44336',
    },
  },
})

const Layout = (props) => {
  const { classes, setWalletAddress, walletAddress } = props;

  return (
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <RateReviewIcon className={classes.icon} />
            <Typography variant="title" color="inherit" noWrap>
              One Piece Most Badass
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography variant="display2" align="center" color="textPrimary" gutterBottom>
                Who's the most badass character in One Piece?
              </Typography>
              <Typography variant="title" align="center" color="textSecondary" paragraph>
                There are a lot of badass characters in One Piece. Zoro, Luffy, Sanji, Kuma, Shanks or even "God" Usopp... So, let's vote!!!
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <form noValidate autoComplete="off">
                      <TextField
                        id="wallet_address"
                        label="Your Private Key"
                        value={walletAddress}
                        onChange={(event) => setWalletAddress(event.target.value)}
                        className={classes.textField}
                        margin="normal"
                      />
                    </form>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              <CandidatesContainer classes={classes} walletAddress={walletAddress} />
            </Grid>
          </div>
        </main>
        <footer className={classes.footer}>
          <Typography variant="title" align="center" gutterBottom>
            One Piece Badass Election
          </Typography>
          <Typography variant="subheading" align="center" color="textSecondary" component="p">
            A small DApp written in Scilla!!!
          </Typography>
        </footer>
      </React.Fragment>
    </MuiThemeProvider>
  )
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};


const enhance = compose(
  withState('walletAddress', 'setWalletAddress', "")
)

export default enhance(withStyles(styles)(Layout));
