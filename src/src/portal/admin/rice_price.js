import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import config from '../../../server/config.json'
import axios from 'axios'
import {
    Grid,
    Button,
    TextField,
    Typography
} from '@material-ui/core'
import Sidemenu from '../sidemenu/sidemenu'

export default class rice_price extends Component {

    constructor(props) {
        super(props)
        this.state = {
            storedToken: localStorage.getItem('token'),
            type: localStorage.getItem('type')
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    validAuth() {
        const { storedToken, type } = this.state
        if (storedToken !== null && type === 'admin') {
            this.getRicePrice()
        } else {
            this.props.history.push('/')
        }
    }

    onChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    getRicePrice() {
        const { storedToken } = this.state
        axios.get(`http://${config.host}:${config.port}/${config.path}/get_rice_price`, {
            headers: { 'x-access-token': storedToken }
        }).then(res => {
            const result = res.data
            for (const ele of result) {
                this.setState({ id: ele.Pr_id, _price: ele.Pr_price })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    updateRicePrice() {
        const { id, price } = this.state
        const data = { id, price }
        console.log(data)
        axios.post(`http://${config.host}:${config.port}/${config.path}/set_rice_price`, data).then(res => {
            const result = res.data
            if (result.result === 'success') {
                console.log('Update Success')
                window.location.reload()
            } else {
                console.log('Update Failed')
            }
        })
    }

    render() {
        const { _price } = this.state
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
                        <Typography variant='h4' style={{ marginBottom: 20 }}>{trans.title}</Typography>
                        <Typography
                            variant='h6'
                            style={{ marginBottom: 30 }}>
                            ปัจจุบัน กิโลกรัมละ {_price} บาท</Typography>
                        <Grid
                            container
                            direction='row'>
                            <TextField
                                label='ราคาที่ต้องการ'
                                variant='standard'
                                name='price'
                                type='number'
                                onChange={this.onChange}
                                style={{ width: 200 }} />
                            <Button
                                variant='contained'
                                onClick={() => this.updateRicePrice()}
                                style={{ width: 50, height: 55, marginLeft: 30 }}>
                                บันทึก
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}