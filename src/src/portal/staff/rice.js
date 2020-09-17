import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import config from '../../../server/config.json'
import axios from 'axios'
import {
    Grid,
    Typography,
    TextField,
    Fab
} from '@material-ui/core'
import {
    Save
} from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import Sidemenu from '../sidemenu/sidemenu'

export default class rice extends Component {

    constructor(props) {
        super(props)
        this.state = {
            storedToken: localStorage.getItem('token'),
            type: localStorage.getItem('type'),
            selfName: localStorage.getItem('username'),
            currentDate: '',
            result: [],
            selected: {},
            paddy: 0,
            rice: 0,
            sack: 0,
            paymentNo: 0,
            SUM: 0,
            Mb_id: null
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    validAuth() {
        const { storedToken, type } = this.state
        if (storedToken !== null && type === 'staff') {
            this.initPayslip()
        } else {
            this.props.history.push('/')
        }
    }

    onChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    initPayslip() {
        this.getCurrentDate()
        this.getMemberList()
        this.getPayment()
        this.getRicePrice()
        this.getSelf()
    }

    onSelectMember(val) {
        if (val) {
            this.setState({ Mb_id: val.Mb_id })
        } else {
            this.setState({ Mb_id: null })
        }
    }

    getCurrentDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const today = new Date()
        let date = today.toLocaleDateString('th-th', options)
        this.setState({ currentDate: date })
    }

    getMemberList() {
        const { storedToken } = this.state
        axios.get(`http://${config.host}:${config.port}/${config.path}/member_list`, {
            headers: { 'x-access-token': storedToken }
        }).then(res => {
            const result = res.data
            this.setState({ result })
        }).catch(error => {
            console.log(error)
        })
    }

    getPayment() {
        const { storedToken } = this.state
        axios.get(`http://${config.host}:${config.port}/${config.path}/payment_id`, {
            headers: { 'x-access-token': storedToken }
        }).then(res => {
            const result = res.data
            let paymentNo = result[0]['MAX(Pm_id)'] + 1
            this.setState({ paymentNo })
        }).catch(error => {
            console.log(error)
        })
    }

    getRicePrice() {
        const { storedToken } = this.state
        axios.get(`http://${config.host}:${config.port}/${config.path}/rice_price`, {
            headers: { 'x-access-token': storedToken }
        }).then(res => {
            const result = res.data
            let rice_price = result[0]['Pr_price']
            this.setState({ rice_price })
        }).catch(error => {
            console.log(error)
        })
    }

    getSum(amount, rice_price) {
        return amount * rice_price
    }

    getSelf() {
        const { selfName } = this.state
        let data = { St_user: selfName }
        axios.post(`http://${config.host}:${config.port}/${config.path}/self_St_id`, data)
            .then(res => {
                const result = res.data
                let self_id = result[0]['St_id']
                this.setState({ self_id })
            }).catch(error => {
                console.log(error)
            })
    }

    onSavePayment(currentDate, Mb_id, self_id, sack, paddy, netPrice) {
        let data = {
            Pm_date: currentDate,
            Mb_id,
            St_id: self_id,
            Pm_payments: netPrice
        }
        let data2 = {
            St_id: self_id,
            Rc_kg: rice,
            Rc_sack: paddy,
            Rc_sum: netPrice,
            Rc_date: currentDate
        }
        if (currentDate && Mb_id && self_id && rice && paddy && sack) {
            axios.post(`http://${config.host}:${config.port}/${config.path}/payment_save`, data)
                .then(res => {
                    const result = res.data
                    if (result.result === 'success') {
                        console.log('Save Success')
                    } else {
                        console.log('Save Failed')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            axios.post(`http://${config.host}:${config.port}/${config.path}/rice_save`, data2)
                .then(res => {
                    const result = res.data
                    if (result.result === 'success') {
                        console.log('Save Success')
                    } else {
                        console.log('Save Failed')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            window.location.reload()
        }
    }

    render() {
        const { currentDate, result, paddy, rice, sack, paymentNo, rice_price, Mb_id, self_id } = this.state
        return (
            < Fragment >
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
                        <Typography variant='h4'>{`${trans.bills}: ${paymentNo}`}</Typography>
                        <Typography variant='h4' style={{ marginTop: 20 }}>{currentDate}</Typography>
                        <Autocomplete
                            options={result}
                            getOptionLabel={val => `${val.Mb_fname} ${val.Mb_lname}`}
                            style={{ width: 620, marginTop: 20 }}
                            onChange={(e, val) => {
                                this.onSelectMember(val)
                            }}
                            renderInput={params => (
                                <TextField {...params}
                                    label={trans.member}
                                    variant="outlined"
                                    style={{ width: 620 }} />
                            )} />
                        <Grid>
                            <TextField
                                label={trans.amount + trans.sack}
                                style={{ marginTop: 20, width: 300 }}
                                type='number'
                                variant='outlined'
                                name='sack'
                                onChange={this.onChange}
                                InputProps={{ inputProps: { min: 0 } }} />
                            <TextField
                                label={`${trans.kg} (${trans.paddy})`}
                                style={{ marginLeft: 20, marginTop: 20, width: 300 }}
                                type='number'
                                variant='outlined'
                                name='paddy'
                                onChange={this.onChange}
                                InputProps={{ inputProps: { min: 0 } }} />
                            <TextField
                                label={`${trans.kg} (${trans._rice})`}
                                style={{ marginTop: 20, width: 300 }}
                                type='number'
                                variant='outlined'
                                name='rice'
                                onChange={this.onChange}
                                InputProps={{ inputProps: { min: 0 } }} />
                        </Grid>
                        <Typography variant='h4' style={{ marginTop: 20 }}>{
                            trans.rice_price} ({trans.kg}): {rice_price} {trans.baht}</Typography>
                        <Typography variant='h4' style={{ marginTop: 20 }}>{
                            trans.sum}:  {this.getSum(rice, rice_price)} {trans.baht}</Typography>
                        <Fab
                            style={{ marginTop: 20 }}
                            size='small'
                            onClick={() => {
                                this.onSavePayment(currentDate, Mb_id, self_id, sack, paddy, this.getSum(rice, rice_price))
                            }}
                            color='default'>
                            <Save />
                        </Fab>
                    </Grid>
                </Grid>
            </Fragment >
        )
    }
}