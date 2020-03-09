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

export default class dividend extends Component {

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
            Mb_id: null,
            Di_id: null,
            dividend: []
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    validAuth() {
        const { storedToken, type } = this.state
        if (storedToken !== null && type === 'staff') {
            this.initDividend()
        } else {
            this.props.history.push('/')
        }
    }

    onChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    initDividend() {
        this.getMemberList()
    }

    onSelectMember(val) {
        if (val) {
            this.setState({
                Mb_id: val.Mb_id,
                Di_id: val.Di_id
            })
            this.getDividendList(val.Di_id)
        } else {
            this.setState({ Mb_id: null })
        }
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

    getDividendList(Di_id) {
        const data = { Di_id }
        axios.post(`http://${config.host}:${config.port}/${config.path}/dividend_list`, data).then(res => {
            const result = res.data
            this.setState({ dividend: result })
        }).catch(error => {
            console.log(error)
        })
    }

    dividendCal(val) {
        return val * 2.5
    }

    render() {
        const { result, dividend } = this.state
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
                        <Autocomplete
                            options={result}
                            getOptionLabel={val => `#${val.Mb_id} ${val.Mb_fname} ${val.Mb_lname}`}
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

                        <Grid
                            container
                            direction='row'
                            style={{ width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: "bold" }}>#</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.year}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.amount}{trans.money}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.money}{trans.total}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dividend.map((row, i, ) => (
                                            <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#F8F9F9' : '' }}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>{row.Di_year}</TableCell>
                                                <TableCell>{row.Di_num}</TableCell>
                                                <TableCell>{this.dividendCal(row.Di_num)}</TableCell>
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