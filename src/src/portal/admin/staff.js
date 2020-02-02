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
    TextField,
} from '@material-ui/core'
import {
    Add as AddIcon,
    Close as CloseIcon,
    Save,
    Delete,
    Done,
    Edit
} from '@material-ui/icons'
import Sidemenu from '../sidemenu/sidemenu'

export default class staff extends Component {

    constructor(props) {
        super(props)
        this.state = {
            storedToken: localStorage.getItem('token'),
            type: localStorage.getItem('type'),
            result: [],
            openRegister: false,
            openDelete: false,
            openUpdate: false,
            username: '',
            password: '',
            re_password: '',
            fname: '',
            lname: '',
            address: '',
            age: '',
            salary: '',
            position: '',
            Mb_id: ''
        }
    }

    componentDidMount() {
        this.validAuth()
    }

    getStaffList() {
        const { storedToken } = this.state
        axios.get(`http://${config.host}:${config.port}/${config.path}/staff_list`, {
            headers: { 'x-access-token': storedToken }
        }).then(res => {
            const result = res.data
            this.setState({ result })
        }).catch(error => {
            console.log(error)
        })
    }

    validAuth() {
        const { storedToken, type } = this.state
        if (storedToken !== null && type === 'admin') {
            this.getStaffList()
        } else {
            this.props.history.push('/')
        }
    }

    toggleRegister() {
        this.setState({ openRegister: !this.state.openRegister })
    }

    toggleDelete() {
        this.setState({ openDelete: !this.state.openDelete })
    }

    toggleUpdate() {
        this.setState({ openUpdate: !this.state.openUpdate })

    }

    onSave() {
        const { username, password, re_password, fname, lname, address, age, salary, position } = this.state
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const today = new Date()
        let date = today.toLocaleDateString('th-th', options)
        let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        date = `${date} ${time}`
        const data = { username, password, fname, lname, address, age, salary, position, date }
        if (username && (password === re_password) && fname && lname && address && age && salary && position) {
            axios.post(`http://${config.host}:${config.port}/${config.path}/register_staff`, data)
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

    onChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onDelete(St_id) {
        const data = { St_id }
        axios.post(`http://${config.host}:${config.port}/${config.path}/delete_staff`, data)
            .then(res => {
                const result = res.data
                if (result.result === 'success') {
                    console.log('Delete Success')
                    window.location.reload()
                } else {
                    console.log('Delete Failed')
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    onUpdate(St_id) {
        const { fname, lname, address, age, salary, position } = this.state
        const data = { St_id, fname, lname, address, age, salary, position }
        if (fname && lname && address && age && salary && position) {
            axios.post(`http://${config.host}:${config.port}/${config.path}/update_staff`, data)
                .then(res => {
                    const result = res.data
                    if (result.result === 'success') {
                        console.log('Update Success')
                        window.location.reload()
                    } else {
                        console.log('Update Failed')
                    }
                })
                .catch(error => [
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
                        {trans.add}{trans.staff}
                    </Typography>
                </DialogContent>
                <DialogContent>
                    <TextField
                        fullWidth
                        name='username'
                        onChange={this.onChange}
                        style={{ marginBottom: '15px' }}
                        label={trans.username} />
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        <TextField
                            name='password'
                            type='password'
                            onChange={this.onChange}
                            style={{ width: '45%' }}
                            label={trans.password} />
                        <TextField
                            name='re_password'
                            type='password'
                            onChange={this.onChange}
                            style={{ width: '45%' }}
                            label={trans.re_password} />
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderRegisterText('fname', trans.fname)}
                        {this.renderRegisterText('lname', trans.lname)}
                    </Grid>
                    <TextField
                        fullWidth
                        name='address'
                        onChange={this.onChange}
                        style={{ marginBottom: '15px' }}
                        multiline
                        rows='5'
                        label={trans.address} />
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderRegisterText('age', trans.age)}
                        {this.renderRegisterText('salary', trans.salary)}
                    </Grid>
                    <TextField
                        fullWidth
                        name='position'
                        onChange={this.onChange}
                        style={{ marginBottom: '15px' }}
                        label={trans.position} />
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

    // POPUP DELETE COMFIRM WINDOW
    renderDelete() {
        const { openDelete, St_id } = this.state
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
                        {this.renderActionBtn('secondary', trans.delete, () => this.onDelete(St_id), <Done />)}
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

    // POPUP UPDATE WINDOW
    renderUpdate() {
        const { openUpdate, St_id, fname, lname, address, age, salary, position } = this.state
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
                    <TextField
                        fullWidth
                        name='address'
                        defaultValue={address}
                        onChange={this.onChange}
                        style={{ marginBottom: '15px' }}
                        multiline
                        rows='5'
                        label={trans.address} />
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        style={{ marginBottom: '15px' }}>
                        {this.renderUpdateText('age', age, trans.age)}
                        {this.renderUpdateText('salary', salary, trans.salary)}
                    </Grid>
                    <TextField
                        fullWidth
                        name='position'
                        defaultValue={position}
                        onChange={this.onChange}
                        style={{ marginBottom: '15px' }}
                        label={trans.position} />
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction='row'
                        alignItems='center'
                        justify='space-evenly'>
                        {this.renderActionBtn('primary', trans.save, () => this.onUpdate(St_id), <Save />)}
                        {this.renderActionBtn('secondary', trans.delete, () => this.toggleDelete(), <Delete />)}
                        {this.renderActionBtn('default', trans.cancel, this.toggleUpdate.bind(this), <CloseIcon />)}
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }

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
                        name={trans.menu + trans.admin}
                        type='admin'
                        history={this.props.history} />
                    <Grid
                        xs={10}
                        item
                        container
                        direction='column'
                        style={{ padding: 30 }}>
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
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{trans.id}</TableCell>
                                            <TableCell>{trans.name}</TableCell>
                                            <TableCell>{trans.address}</TableCell>
                                            <TableCell>{trans.age}</TableCell>
                                            <TableCell>{trans.salary}</TableCell>
                                            <TableCell>{trans.position}</TableCell>
                                            <TableCell>{trans.date}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>{row.St_fname} {row.St_lname}</TableCell>
                                                <TableCell>{row.St_address}</TableCell>
                                                <TableCell>{row.St_age}</TableCell>
                                                <TableCell>{row.St_salary}</TableCell>
                                                <TableCell>{row.St_position}</TableCell>
                                                <TableCell>{row.St_date}</TableCell>
                                                <TableCell>
                                                    <Grid
                                                        container
                                                        direction='row'
                                                        justify='space-evenly'
                                                        alignItems='center'>
                                                        <Fab
                                                            size='small'
                                                            onClick={() => {
                                                                this.toggleUpdate(); this.setState({
                                                                    St_id: row.St_id,
                                                                    fname: row.St_fname,
                                                                    lname: row.St_lname,
                                                                    address: row.St_address,
                                                                    age: row.St_age,
                                                                    salary: row.St_salary,
                                                                    position: row.St_position
                                                                })
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
