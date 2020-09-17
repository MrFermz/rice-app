import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import config from '../../../server/config.json'
import axios from 'axios'
import {
    Grid,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import Sidemenu from '../sidemenu/sidemenu'

export default class payment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            storedToken: localStorage.getItem('token'),
            type: localStorage.getItem('type'),
            selfName: localStorage.getItem('username'),
            result: []
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    validAuth() {
        const { storedToken, type } = this.state
        if (storedToken !== null && type === 'admin') {
            this.getPayment()
        } else {
            this.props.history.push('/')
        }
    }

    getPayment() {
        const { storedToken } = this.state
        let resultStaff = [], resultAdmin = []
        let result = []
        axios.get(`http://${config.host}:${config.port}/${config.path}/getPaymentStaff`, {
            headers: { 'x-access-token': storedToken }
        }).then(res => {
            resultAdmin = []
            resultStaff = res.data

            axios.get(`http://${config.host}:${config.port}/${config.path}/getPaymentAdmin`, {
                headers: { 'x-access-token': storedToken }
            }).then(res => {
                resultAdmin = res.data
            })
            result = resultStaff.concat(resultAdmin)
            this.setState({ result })
        })
    }

    onSelectPayment(val) {
        let data = [val]
        if (val) {
            this.setState({ result: data })
        } else {
            this.getPayment()
        }
    }

    render() {
        const { result } = this.state
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
                        <Autocomplete
                            options={result}
                            getOptionLabel={val => `#${val.Pm_id} เมื่อวันที่ ${val.Pm_date}`}
                            style={{ width: 620, marginTop: 20 }}
                            onChange={(e, val) => {
                                this.onSelectPayment(val)
                            }}
                            renderInput={params => (
                                <TextField {...params}
                                    label='ค้นหาเลขใบเสร็จ'
                                    variant="outlined"
                                    style={{ width: 620 }} />
                            )} />
                        <Grid
                            container
                            direction='row'
                            style={{ width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: "bold" }}>#</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.pay_date}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.member}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans._amount}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.operator}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.map((row, i) => (
                                            <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#F8F9F9' : '' }}>
                                                <TableCell>{row.Pm_id}</TableCell>
                                                <TableCell>{row.Pm_date}</TableCell>
                                                <TableCell>{row.Mb_fname} {row.Mb_lname}</TableCell>
                                                <TableCell>{row.Pm_payments}</TableCell>
                                                {row.St_id
                                                    ? <TableCell>{row.St_fname} {row.St_lname}</TableCell>
                                                    : <TableCell>{row.Ad_user}</TableCell>}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}