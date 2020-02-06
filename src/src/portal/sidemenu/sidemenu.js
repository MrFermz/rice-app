import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import {
    Grid,
    Button,
    Typography
} from '@material-ui/core'
import {
    ExitToApp
} from '@material-ui/icons'

export default class sidemenu extends Component {

    onLogout() {
        localStorage.clear('token')
        localStorage.clear('type')
        localStorage.clear('username')
        this.props.history.push('/')
    }

    renderUsers(location, label) {
        return (
            <Fragment>
                <Button
                    fullWidth
                    variant='text'
                    color='default'
                    style={{ height: 75 }}
                    onClick={() => this.props.history.push(location)}>
                    <Typography>
                        {label}
                    </Typography>
                </Button>
            </Fragment>
        )
    }

    renderType(type) {
        if (type === 'admin') {
            return (
                <Fragment>
                    {this.renderUsers('admin', trans.home)}
                    {this.renderUsers('adminMember', trans.member)}
                    {this.renderUsers('adminStaff', trans.staff)}
                    {this.renderUsers('adminRice', trans.rice)}
                    {/* {this.renderUsers('adminPayment', trans.payment)} */}
                    {this.renderUsers('adminDividend', trans.dividend)}
                    {this.renderUsers('adminRicePrice', trans.rice_price)}
                </Fragment>
            )
        } if (type === 'staff') {
            return (
                <Fragment>
                    {this.renderUsers('staff', trans.home)}
                    {this.renderUsers('staffMember', trans.member)}
                    {this.renderUsers('staffRice', trans.rice)}
                    {/* {this.renderUsers('staffPayment', trans.payment)} */}
                    {this.renderUsers('staffDividend', trans.dividend)}
                </Fragment>
            )
        }
    }

    render() {
        const type = this.props.type
        return (
            <Fragment>
                <Grid
                    xs={2}
                    item
                    container
                    direction='column'
                    justify='flex-start'
                    alignItems='center'
                    style={{ backgroundColor: '#EAECEE' }}>
                    <Grid
                        container
                        style={{ height: '100vh' }}>
                        <Grid
                            container
                            direction='column'
                            justify='flex-start'
                            alignItems='center'>
                            <Typography
                                variant='h4'
                                style={{ margin: '10px 0px 10px 0px' }}>
                                {this.props.name}
                            </Typography>
                            {this.renderType(type)}
                        </Grid>
                        <Grid
                            container
                            direction='column'
                            justify='flex-end'
                            alignItems='center'
                            style={{ marginBottom: '20px' }}>
                            <Button
                                fullWidth
                                variant='text'
                                color='secondary'
                                startIcon={<ExitToApp />}
                                style={{ height: 75 }}
                                onClick={this.onLogout.bind(this)}>
                                <Typography>
                                    {trans.logout}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}