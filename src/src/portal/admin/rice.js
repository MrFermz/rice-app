import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import {
    Grid, Typography
} from '@material-ui/core'

import Sidemenu from '../sidemenu/sidemenu'

export default class rice extends Component {
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
                            {trans.rice}
                        </Typography>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}