import React from 'react'
import Badge from '@material-ui/core/Badge'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import BN from 'bn.js'
import { zilliqa, zilliqaNode, smartContractAddreses } from '../../../helper.js'
import { compose, withState, lifecycle, withHandlers } from 'recompose'

const CandidatesContainer = (props) => {
  const { cards, classes, walletAddress, castVote } = props
  return (
    cards.map(card => {
      return (
        <Grid item key={card.key} sm={6} md={4} lg={3}>
          <Card>
            <CardContent>
              <Badge color={card.val > 0 ? "secondary" : "primary"} badgeContent={card.val} className={classes.margin}>
                <Typography variant="display1" className={classes.padding}>{card.key}</Typography>
              </Badge>
            </CardContent>
            <CardActions>
              <Button disabled={walletAddress ? false : true} fullWidth={true} size="small" variant="contained" color="primary" onClick={() => castVote(walletAddress, card.key)}>VOTE</Button>
            </CardActions>
          </Card>
        </Grid>
      )
    })
  )
}

const enhance = compose(
  withState('cards', 'setCards', []),
  withHandlers({
    castVote: (props) => (walletAddress, candidate) => {
      try {
        const address = zilliqa.util.getAddressFromPrivateKey(walletAddress)
        console.log('Address', address.toString('hex'))
        console.log('SmartContract Address', smartContractAddreses)

        zilliqaNode.getBalance({ address }, (err, data) => {
          if (err || (data.result && data.result.Error)) {
            console.log(err);
            console.log(data.result);
          } else {
            const { nonce } = data.result;

            const newNonce = nonce + 1;

            const msg = {
              _tag: "castVote",
              _amount: "0",
              _sender: `0x${address}`,
              params: [
                {
                  vname: "name",
                  type: "String",
                  value: candidate
                }
              ]
            }

            const txnDetails = {
              version: 0,
              nonce: newNonce, // increment by 1 from the last transaction's nonce
              to: smartContractAddreses,
              amount: new BN(0),
              gasPrice: 1,
              gasLimit: 2000,
              data: JSON.stringify(msg).replace(/\\"/g, '"')
            }

            const txn = zilliqa.util.createTransactionJson(walletAddress, txnDetails)

            zilliqaNode.createTransaction(txn, (err, data) => {
              if (err || data.error) {
                console.log(err)
              } else {
                console.log(data)
                window.location.reload()
              }
            })
          }
        })
      }
      catch (err) {
        console.log(err)
        alert("Your Private Key is not correct!")
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const { setCards } = this.props
      zilliqaNode.getSmartContractState({ address: smartContractAddreses }, function (err, data) {
        if (err || (data.result && data.result.Error)) {
          console.log('err')
        } else {
          const result = JSON.stringify(data.result)
          const elections = _.filter(JSON.parse(result), (el) => el.vname === "elections")[0].value
          setCards(elections)
        }
      })
    }
  })
)


export default enhance(CandidatesContainer);