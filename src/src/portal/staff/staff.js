import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import {
    Grid,
    Typography,
    Button
} from '@material-ui/core'
import Sidemenu from '../sidemenu/sidemenu'

export default class staff extends Component {

    renderCardsMenu(name, location, color) {
        return (
            <Button
                variant='contained'
                onClick={() => this.props.history.push(location)}
                style={{ margin: 15, width: 200, height: 200, backgroundColor: color, borderRadius: 30 }}>
                <Typography>{name}</Typography>
            </Button>
        )
    }

    render() {
        return (
            <Fragment>
                <Grid
                    container
                    direction='row'>
                    <Sidemenu
                        name={trans.menu + trans.staff}
                        type='staff'
                        history={this.props.history} />
                    <Grid
                        xs={10}
                        item
                        container
                        direction='column'
                        style={{ padding: 30 }}>
                        <Typography variant='h4' style={{ marginBottom: 20 }}>{trans.title}</Typography>
                        <Typography>
                            {this.renderCardsMenu(trans.member, 'staffMember', '#ABEBC6')}
                            {this.renderCardsMenu(trans.rice, 'staffRice', '#AED6F1')}
                            {this.renderCardsMenu(trans.payment, 'staffPayment', '#D2B4DE')}
                            {this.renderCardsMenu(trans.dividend, 'staffDividend', '#F5B7B1')}
                        </Typography>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}