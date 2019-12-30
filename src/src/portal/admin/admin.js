import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import {
    Grid,
    Typography,
    Button
} from '@material-ui/core'

import Sidemenu from '../sidemenu/sidemenu'

export default class admin extends Component {

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
                        name={trans.menu + trans.admin}
                        type='admin'
                        history={this.props.history} />
                    <Grid
                        xs={10}
                        item
                        container
                        direction='column'
                        style={{ padding: 30 }}>
                        <Typography>
                            {this.renderCardsMenu(trans.member, 'adminMember', '#ABEBC6')}
                            {this.renderCardsMenu(trans.staff, 'adminStaff', '#A3E4D7')}
                            {this.renderCardsMenu(trans.rice, 'adminRice', '#AED6F1')}
                            {this.renderCardsMenu(trans.payment, 'adminPayment', '#D2B4DE')}
                            {this.renderCardsMenu(trans.dividend, 'adminDividend', '#F5B7B1')}
                        </Typography>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}