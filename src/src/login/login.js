import React, { Component, Fragment } from 'react'
import trans from '../../lang/th-th.json'
import config from '../../server/config.json'
import axios from 'axios'
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    Fab,
    Typography
} from '@material-ui/core'

export default class login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            type: 'staff',
            storedToken: localStorage.getItem('token'),
            storedtype: localStorage.getItem('type'),
            message: ''
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    validAuth() {
        const { storedToken, storedtype } = this.state
        if (storedToken !== null && storedtype !== null) {
            this.props.history.push(`/${storedtype}`)
        } else {
            this.props.history.push('/')
        }
    }

    onChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onLogin() {
        const { username, password, type } = this.state
        const data = { username, password }
        axios.post(`http://${config.host}:${config.port}/${config.path}/login_${type}`, data)
            .then(res => {
                const result = res.data
                if (result.result === 'success') {

                    //save token
                    localStorage.setItem('token', result.data)
                    localStorage.setItem('type', type)
                    localStorage.setItem('username', username)

                    //show successful
                    let passtype
                    switch (type) {
                        case 'admin':
                            passtype = 'admin'
                            break
                        case 'member':
                            passtype = 'member'
                            break
                        case 'staff':
                            passtype = 'staff'
                            break
                        default:
                            passtype = 'error'
                            break
                    }
                    this.props.history.push(`/${passtype}`)
                } else {
                    this.setState({ message: 'ล็อกอินไม่สำเร็จ' })
                }
            })
            .catch(error => {
                this.setState({ message: error })
            })
    }

    render() {
        const { message } = this.state
        return (
            <Fragment>
                <Grid
                    container
                    direction='column'
                    justify='center'
                    alignItems='center'
                    style={{ height: '100vh' }}>
                    <Typography variant='h3'>
                        {trans.login}
                    </Typography>
                    <TextField
                        name='username'
                        onChange={this.onChange}
                        label={trans.username}
                        style={{ marginTop: '20px', width: '15%' }} />
                    <TextField
                        name='password'
                        type='password'
                        onChange={this.onChange}
                        label={trans.password}
                        style={{ marginTop: '20px', width: '15%' }} />
                    <Select
                        name='type'
                        defaultValue='staff'
                        onChange={this.onChange}
                        style={{ marginTop: '20px', width: '15%' }}>
                        <MenuItem value='staff'>{trans.staff}</MenuItem>
                        <MenuItem value='admin'>{trans.admin}</MenuItem>
                    </Select>
                    <Typography
                        style={{ color: 'red', marginTop: '10px' }}>{message}</Typography>
                    <Fab
                        onClick={this.onLogin.bind(this)}
                        color='primary'
                        style={{ marginTop: '20px' }}>
                        {trans.login}
                    </Fab>
                </Grid>
            </Fragment>
        )
    }
}