import React, { Component, Fragment } from 'react'
import trans from '../../../lang/th-th.json'
import config from '../../../server/config.json'
import axios from 'axios'
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Fab,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    TextField
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    Add as AddIcon,
    Close as CloseIcon,
    Save,
    Delete,
    Done,
    Edit
} from '@material-ui/icons'
import Sidemenu from '../sidemenu/sidemenu'

export default class member extends Component {

    constructor(props) {
        super(props)
        this.state = {
            storedToken: localStorage.getItem('token'),
            type: localStorage.getItem('type'),
            result: [],
            openRegister: false,
            openDelete: false,
            openUpdate: false,
            fname: '',
            lname: '',
            email: '',
            tel: '',
            address: '',
            Mb_id: '',
            dividend: 0
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    validAuth() {
        const { storedToken, type } = this.state
        if (storedToken !== null && type === 'staff') {
            this.getMemberList()
        } else {
            this.props.history.push('/')
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

    // TOGGLE FUNCTION
    toggleRegister() {
        this.setState({ openRegister: !this.state.openRegister })
    }

    toggleDelete() {
        this.setState({ openDelete: !this.state.openDelete })
    }

    toggleUpdate() {
        this.setState({ openUpdate: !this.state.openUpdate })
    }

    // SET STATE
    onChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    // SAVE MEMBER TO DATABASE
    onSave() {
        const { fname, lname, email, tel, address, dividend } = this.state
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const today = new Date()
        let date = today.toLocaleDateString('th-th', options)
        let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        date = `${date} ${time}`
        const data = { fname, lname, email, tel, address, date, dividend }
        if (fname && lname && email && tel && address) {
            axios.post(`http://${config.host}:${config.port}/${config.path}/register_member`, data)
                .then(res => {
                    const result = res.data
                    if (result.result === 'success') {
                        console.log('Register Success')
                    } else {
                        console.log('Register Failed')
                    }
                    this.toggleRegister()
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    // DELETE MEMBER FROM DATABASE
    onDelete(Mb_id, Di_id) {
        let dataDividend = { Di_id }
        axios.post(`http://${config.host}:${config.port}/${config.path}/delete_dividend`, dataDividend).then(res => {
            const result = res.data
            if (result.result === 'success') {
                console.log('Delete Success')
                window.location.reload()
            } else {
                console.log('Delete Failed')
            }
        }).then(() => {
            const data = { Mb_id }
            axios.post(`http://${config.host}:${config.port}/${config.path}/delete_member`, data).then(res => {
                const result = res.data
                if (result.result === 'success') {
                    console.log('Delete Success')
                } else {
                    console.log('Delete Failed')
                }
            })
        }).catch(error => {
            console.log(error)
        })
    }

    // UPDATE MEMBER DATA AND SAVE TO DATABASE
    onUpdate(Mb_id) {
        const { fname, lname, email, tel, address, dividend, Di_id } = this.state
        const data = { Mb_id, fname, lname, email, tel, address }
        if (fname && lname && email && tel && address) {
            axios.post(`http://${config.host}:${config.port}/${config.path}/update_member`, data).then(res => {
                const result = res.data
                if (result.result === 'success') {
                    console.log('Update Success')
                } else {
                    console.log('Update Failed')
                }
            }).then(() => {
                let dataDividend = { Di_id, dividend }
                axios.post(`http://${config.host}:${config.port}/${config.path}/update_dividend`, dataDividend).then(res => {
                    const result = res.data
                    if (result.result === 'success') {
                        console.log('Update Success')
                        window.location.reload()
                    } else {
                        console.log('Update Failed')
                    }
                })
            }).catch(error => [
                console.log(error)
            ])
        }
    }

    // RENDER REGISTER TEXT
    renderRegisterText(name, label) {
        return (
            <TextField
                name={name}
                onChange={this.onChange}
                style={{ width: '45%' }}
                label={label} />
        )
    }

    // POPUP REGISTER WINDOW
    renderRegister() {
        const { openRegister } = this.state
        return (
            <Dialog
                fullWidth
                open={openRegister}
                onClose={this.toggleRegister.bind(this)}>
                <DialogContent>
                    <Typography>
                        {trans.add}{trans.member}
                    </Typography>
                </DialogContent>
                <DialogContent>
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderRegisterText('fname', trans.fname)}
                        {this.renderRegisterText('lname', trans.lname)}
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderRegisterText('email', trans.email)}
                        {this.renderRegisterText('tel', trans.tel)}
                    </Grid>
                    <TextField
                        fullWidth
                        name='address'
                        onChange={this.onChange}
                        multiline
                        rows='5'
                        label={trans.address} />
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        <TextField
                            label={`${trans.deposit}`}
                            style={{ marginTop: 20, width: 300 }}
                            type='number'
                            variant='outlined'
                            name='dividend'
                            onChange={this.onChange}
                            InputProps={{ inputProps: { min: 0 } }} />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction='row'
                        alignItems='center'
                        justify='space-evenly'>
                        {this.renderActionBtn('primary', trans.add, this.onSave.bind(this), <Save />)}
                        {this.renderActionBtn('default', trans.cancel, this.toggleRegister.bind(this), <CloseIcon />)}
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }

    // POPUP DELETE WINDOW
    renderDelete() {
        const { openDelete, Mb_id, Di_id } = this.state
        return (
            <Dialog
                fullWidth
                open={openDelete}
                onClose={this.toggleDelete.bind(this)}>
                <DialogContent>
                    <Typography
                        style={{ width: '300px', height: '150px' }}>
                        {trans.delete_comfirm} ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction='row'
                        alignItems='center'
                        justify='space-evenly'>
                        {this.renderActionBtn('secondary', trans.delete, () => this.onDelete(Mb_id, Di_id), <Done />)}
                        {this.renderActionBtn('default', trans.cancel, () => this.toggleDelete(), <CloseIcon />)}
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }

    // RENDER UPDATE TEXT
    renderUpdateText(name, def, label) {
        return (
            <TextField
                name={name}
                defaultValue={def}
                onChange={this.onChange}
                style={{ width: '45%' }}
                label={label} />
        )
    }

    // RENDER ACTION BUTTON
    renderActionBtn(color, label, click, icon) {
        return (
            <Fab
                variant='extended'
                onClick={click}
                color={color}>
                {icon}
                <Typography>{label}</Typography>
            </Fab>
        )
    }


    // GET DIVIDEND
    getDividendList(Di_id) {
        const data = { Di_id }
        axios.post(`http://${config.host}:${config.port}/${config.path}/dividend_list`, data).then(res => {
            const result = res.data
            this.setState({ dividend: result[0].Di_num })
        }).then(() => {
            this.toggleUpdate();
        }).catch(error => {
            console.log(error)
        })
    }


    // POPUP UPDATE WINDOW
    renderUpdate() {
        const { openUpdate, Mb_id, fname, lname, email, tel, address, dividend } = this.state
        return (
            <Dialog
                fullWidth
                open={openUpdate}
                onClose={this.toggleUpdate.bind(this)}>
                <DialogContent>
                    <Typography>
                        {trans.update}
                    </Typography>
                </DialogContent>
                <DialogContent>
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderUpdateText('fname', fname, trans.fname)}
                        {this.renderUpdateText('lname', lname, trans.lname)}
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderUpdateText('email', email, trans.email)}
                        {this.renderUpdateText('tel', tel, trans.tel)}
                    </Grid>
                    <TextField
                        fullWidth
                        name='address'
                        defaultValue={address}
                        onChange={this.onChange}
                        multiline
                        rows='5'
                        label={trans.address} />
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        <TextField
                            label={`${trans.deposit}`}
                            style={{ marginTop: 20, width: 300 }}
                            type='number'
                            variant='outlined'
                            name='dividend'
                            defaultValue={dividend}
                            onChange={this.onChange}
                            InputProps={{ inputProps: { min: 0 } }} />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction='row'
                        alignItems='center'
                        justify='space-evenly'>
                        {this.renderActionBtn('primary', trans.save, () => this.onUpdate(Mb_id), <Save />)}
                        {this.renderActionBtn('secondary', trans.delete, () => this.toggleDelete(), <Delete />)}
                        {this.renderActionBtn('default', trans.cancel, this.toggleUpdate.bind(this), <CloseIcon />)}
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }

    // MEMBER SEARCH
    onSelectMember(val) {
        let data = [val]
        if (val) {
            this.setState({ result: data })
        } else {
            this.getMemberList()
            // this.setState({ result })
        }
    }

    // MAIN WINDOW
    render() {
        const { result } = this.state
        return (
            <Fragment>
                {this.renderRegister()}
                {this.renderDelete()}
                {this.renderUpdate()}
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
                        <Grid
                            container
                            justify='flex-end'
                            direction='row'>
                            <Fab
                                variant='extended'
                                color='primary'
                                onClick={this.toggleRegister.bind(this)}>
                                <AddIcon />
                                <Typography>{trans.add}</Typography>
                            </Fab>
                        </Grid>
                        <Grid
                            container
                            direction='row'
                            style={{ width: '100%' }}>
                            <Autocomplete
                                options={result}
                                getOptionLabel={val => `#${val.Mb_id} ${val.Mb_fname} ${val.Mb_lname}`}
                                style={{ marginTop: 20 }}
                                onChange={(e, val) => {
                                    this.onSelectMember(val)
                                }}
                                renderInput={params => (
                                    <TextField {...params}
                                        label={trans.member}
                                        variant="outlined"
                                        style={{ width: 400 }} />
                                )} />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.id}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.name}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.email}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.tel}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.address}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{trans.date}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.map((row, i, ) => (
                                            <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#F8F9F9' : '' }}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>{row.Mb_fname} {row.Mb_lname}</TableCell>
                                                <TableCell>{row.Mb_email}</TableCell>
                                                <TableCell>{row.Mb_tel}</TableCell>
                                                <TableCell>{row.Mb_address}</TableCell>
                                                <TableCell>{row.Mb_date}</TableCell>
                                                <TableCell>
                                                    <Grid
                                                        container
                                                        direction='row'
                                                        justify='space-evenly'
                                                        alignItems='center'>
                                                        <Fab
                                                            size='small'
                                                            onClick={() => {
                                                                this.setState({
                                                                    Mb_id: row.Mb_id,
                                                                    fname: row.Mb_fname,
                                                                    lname: row.Mb_lname,
                                                                    email: row.Mb_email,
                                                                    tel: row.Mb_tel,
                                                                    address: row.Mb_address,
                                                                    Di_id: row.Di_id
                                                                });
                                                                this.getDividendList(row.Di_id);
                                                            }}
                                                            color='default'>
                                                            <Edit />
                                                        </Fab>
                                                    </Grid>
                                                </TableCell>
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