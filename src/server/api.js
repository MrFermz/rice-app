const express = require('express')
const app = express.Router()
var mysql = require('mysql')
const database = require("./db_config")
var bcrypt = require('bcryptjs')
const { getToken, verifyToken } = require('./jwtHandler')

// --------------------------------------------

const result_failed = {
    result: "failed",
    data: ""
}


// ADMIN API
app.post('/register_admin', (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 8)
    req.body.password = hashedPassword
    let values = [
        [req.body.username, req.body.password]
    ]
    let sql = `INSERT INTO admin (Ad_user, Ad_pass) VALUES ?`
    database.conn.query(sql, [values], function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.post('/login_admin', (req, res) => {
    let sql = `SELECT 
            Ad_id,
            Ad_user,
            Ad_pass
            FROM admin
            WHERE Ad_user = '${req.body.username}'`
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].Ad_pass)
                if (!passwordIsValid) return res.json(result_failed)

                let _username = result[0].Ad_user
                let _id = result[0].id

                let token = getToken({ id: _id, username: _username })

                const finalResult = {
                    result: "success",
                    data: token
                }
                res.json(finalResult)
            } else {
                const finalResult = {
                    result: "failed",
                    data: ""
                }
                res.json(finalResult)
            }
        }
    })
})

app.post('/self_Ad_id', (req, res) => {
    let sql = `SELECT Ad_id FROM admin WHERE Ad_user = '${req.body.Ad_user}'`
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})


// MEMBER API
app.post('/register_member', (req, res) => {
    let today = new Date()
    let year = today.getFullYear()
    let valuesMember = [
        [req.body.fname, req.body.lname, req.body.email, req.body.tel, req.body.address, req.body.date]
    ]
    let sqlMember = `INSERT INTO member (Mb_fname, Mb_lname, Mb_email, Mb_tel, Mb_address, Mb_date) VALUES ?`
    database.conn.query(sqlMember, [valuesMember], function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            let Mb_id = result['insertId']
            let valuesDividend = [[
                year,
                req.body.dividend,
                Mb_id
            ]]
            let sqlDividend = `INSERT INTO dividend (Di_year, Di_num, Mb_id) VALUES ?`
            database.conn.query(sqlDividend, [valuesDividend], function (err, result) {
                if (err) {
                    console.log(err)
                    res.json(result_failed)
                } else {
                    const finalResult = {
                        result: "success",
                        data: ""
                    }
                    res.json(finalResult)
                }
            })
        }
    })
})

app.post('/delete_member', (req, res) => {
    let sql = `DELETE FROM member 
            WHERE Mb_id = ${req.body.Mb_id}`
    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.post('/update_member', (req, res) => {
    let sql = `UPDATE member 
            SET Mb_fname = '${req.body.fname}', 
                Mb_lname = '${req.body.lname}', 
                Mb_email = '${req.body.email}', 
                Mb_tel = '${req.body.tel}', 
                Mb_address = '${req.body.address}' 
            WHERE Mb_id = ${req.body.Mb_id}`

    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.get('/member_list', verifyToken, (req, res) => {
    let sql = `SELECT member.Mb_id, member.Mb_fname, member.Mb_lname, member.Mb_email, member.Mb_tel, member.Mb_address, member.Mb_date, dividend.Di_id
                FROM member
                INNER JOIN dividend ON member.Mb_id = dividend.Mb_id`
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})


// STAFF API
app.post('/register_staff', (req, res) => {
    const obj = req.body
    var hashedPassword = bcrypt.hashSync(req.body.password, 8)
    req.body.password = hashedPassword
    let values = [
        [req.body.username, req.body.password, req.body.fname, req.body.lname, req.body.address, req.body.age, req.body.salary, req.body.position, req.body.date]
    ]
    let sql = `INSERT INTO staff (St_user, St_pass, St_fname, St_lname, St_address, St_age, St_salary, St_position, St_date) VALUES ?`
    database.conn.query(sql, [values], function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.post('/login_staff', (req, res) => {
    let sql = `SELECT 
            St_id,
            St_user,
            St_pass 
            FROM staff 
            WHERE St_user = '${req.body.username}'`
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].St_pass)
                if (!passwordIsValid) return res.json(result_failed)

                let _username = result[0].St_user
                let _id = result[0].id

                let token = getToken({ id: _id, username: _username })

                const finalResult = {
                    result: "success",
                    data: token
                }
                res.json(finalResult)
            } else {
                const finalResult = {
                    result: "failed",
                    data: ""
                }
                res.json(finalResult)
            }
        }
    })
})

app.post('/delete_staff', (req, res) => {
    let sql = `DELETE FROM staff 
            WHERE St_id = ${req.body.St_id}`
    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.post('/update_staff', (req, res) => {
    let sql = `UPDATE staff 
            SET St_fname = '${req.body.fname}', 
                St_lname = '${req.body.lname}', 
                St_address = '${req.body.address}', 
                St_age = '${req.body.age}', 
                St_salary = '${req.body.salary}', 
                St_position = '${req.body.position}' 
            WHERE St_id = ${req.body.St_id}`
    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.get('/staff_list', verifyToken, (req, res) => {
    let sql = 'SELECT * FROM staff'
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})

app.post('/self_St_id', (req, res) => {
    let sql = `SELECT St_id FROM staff WHERE St_user = '${req.body.St_user}'`
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})


// PRICE
app.get('/rice_price', verifyToken, (req, res) => {
    let sql = 'SELECT * from rice_price'
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})

app.post('/rice_save', (req, res) => {
    let sql
    if (req.body.type == 'admin') {
        sql = `INSERT INTO rice (Rc_kg, Rc_sack, Rc_sum, Rc_date, Ad_id) VALUES ?`
    } else {
        sql = `INSERT INTO rice (Rc_kg, Rc_sack, Rc_sum, Rc_date, St_id) VALUES ?`
    }
    let values = [
        [req.body.Rc_kg, req.body.Rc_sack, req.body.Rc_sum, req.body.Rc_date, req.body.St_id]
    ]
    database.conn.query(sql, [values], function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})


// RICE
app.get('/payment_id', verifyToken, (req, res) => {
    let sql = 'SELECT MAX(Pm_id) from payment'
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})

app.post('/payment_save', (req, res) => {
    let sql
    if (req.body.type == 'admin') {
        sql = `INSERT INTO payment (Pm_payments, Pm_date, Mb_id, Ad_id) VALUES ?`
    } else {
        sql = `INSERT INTO payment (Pm_payments, Pm_date, Mb_id, St_id) VALUES ?`
    }
    let values = [
        [req.body.Pm_payments, req.body.Pm_date, req.body.Mb_id, req.body.St_id]
    ]
    database.conn.query(sql, [values], function (error, result) {
        if (error) {
            console.log(error)
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})


// DIVIDEND
app.post('/dividend_list', (req, res) => {
    let sql = `SELECT * FROM dividend WHERE Di_id=${req.body.Di_id}`
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})

app.post('/update_dividend', (req, res) => {
    let sql = `UPDATE dividend 
            SET Di_num = '${req.body.dividend}'
            WHERE Di_id = ${req.body.Di_id}`
    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.post('/delete_dividend', (req, res) => {
    let sql = `DELETE FROM dividend 
            WHERE Di_id = ${req.body.Di_id}`
    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})


// RICE PRICE
app.get('/get_rice_price', verifyToken, (req, res) => {
    let sql = 'SELECT Pr_id, Pr_price FROM rice_price'
    database.conn.query(sql, function (err, result) {
        if (err) {
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})

app.post('/set_rice_price', (req, res) => {
    let sql
    if (!req.body.id) {
        sql = `INSERT INTO rice_price (Pr_price) VALUES (${req.body.price})`
    } else {
        sql = `UPDATE rice_price
                    SET Pr_price = ${req.body.price}
                    WHERE Pr_id = ${req.body.id}`
    }
    database.conn.query(sql, function (error, result) {
        if (error) {
            res.json(result_failed)
        } else {
            const finalResult = {
                result: "success",
                data: ""
            }
            res.json(finalResult)
        }
    })
})

app.get('/getPaymentStaff', verifyToken, (req, res) => {
    let sql =   `SELECT payment.Pm_id, 
                        payment.Pm_payments, 
                        payment.Pm_date, 
                        payment.Mb_id, 
                        payment.St_id,
                        payment.Ad_id,
                        member.Mb_fname,
                        member.Mb_lname,
                        staff.St_fname,
                        staff.St_lname
                 FROM payment
                 INNER JOIN member  ON payment.Mb_id = member.Mb_id
                 INNER JOIN staff   ON payment.St_id = staff.St_id`
    database.conn.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})

app.get('/getPaymentAdmin', verifyToken, (req, res) => {
    let sql =   `SELECT payment.Pm_id, 
                        payment.Pm_payments, 
                        payment.Pm_date, 
                        payment.Mb_id, 
                        payment.St_id,
                        payment.Ad_id,
                        member.Mb_fname,
                        member.Mb_lname,
                        admin.Ad_user
                 FROM payment
                 INNER JOIN member  ON payment.Mb_id = member.Mb_id
                 INNER JOIN admin   ON payment.Ad_id = admin.Ad_id`
    database.conn.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.json(result_failed)
        } else {
            if (result.length > 0) {
                res.send(result)
            }
        }
    })
})



module.exports = app