import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'
import {
    createMuiTheme,
    MuiThemeProvider
} from '@material-ui/core/styles'

import Login from './login/login'

// ADMIN PORTAL
import Admin from './portal/admin/admin'
import adminMember from './portal/admin/member'
import adminStaff from './portal/admin/staff'
import adminRice from './portal/admin/rice'
import adminPayment from './portal/admin/payment'
import adminDividend from './portal/admin/dividend'


// STAFF PORTAL
import Staff from './portal/staff/staff'
import staffMember from './portal/staff/member'
import staffRice from './portal/staff/rice'
import staffPayment from './portal/staff/payment'
import staffDividend from './portal/staff/dividend'

const theme = createMuiTheme({
    typography: {
        'fontFamily': 'Sarabun'
    }
})

export default class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <Route exact path='/' component={Login} />


                    {/* PORTAL */}

                    {/* ADMIN */}
                    <Route path='/admin' component={Admin} />
                    <Route path='/adminMember' component={adminMember} />
                    <Route path='/adminStaff' component={adminStaff} />
                    <Route path='/adminRice' component={adminRice} />
                    <Route path='/adminPayment' component={adminPayment} />
                    <Route path='/adminDividend' component={adminDividend} />

                    {/* STAFF */}
                    <Route path='/staff' component={Staff} />
                    <Route path='/staffMember' component={staffMember} />
                    <Route path='/staffRice' component={staffRice} />
                    <Route path='/staffPayment' component={staffPayment} />
                    <Route path='/staffDividend' component={staffDividend} />

                </Router>
            </MuiThemeProvider>
        )
    }
}