const mysql = require('mysql')
const config = require('./config.json')

// --------------------------------------------

const mHost = config.host
const mUsername = config.user
const mPassword = config.pass
const mDatabase = config.database

const conn = mysql.createConnection({
    host: mHost,
    user: mUsername,
    password: mPassword,
    database: mDatabase
})

function connectDB() {
    const conn = mysql.createConnection({
        host: mHost,
        user: mUsername,
        password: mPassword,
    })

    // CONNECT DATABASE
    conn.connect((error) => {
        if (error) {
            console.log(`error: ${error}`)
            setTimeout(connectDB, 2000)
        }
        conn.query("CREATE DATABASE IF NOT EXISTS " + mDatabase + " CHARACTER SET utf8 COLLATE utf8_general_ci", function (error, result) {
            console.log("Database Available")
            connectTable()

            // Add FK
            connectForeignKey()
        })
    })

    // AUTO RESTART
    conn.on('error', function (error) {
        console.log('db error', error)
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            connectDB()
        } else {
            throw error
        }
    })
}


// CONNECT TABLE
function connectTable() {
    connectTableAdmin()
    connectTableMember()
    connectTableStaff()
    connectTablePayment()
    connectTableRice()
    connectTableDividend()
    connectTableRicePrice()


}

// FOREIGN KEY INIT
function connectForeignKey() {

    // Di_id
    let sqlMember = 'ALTER TABLE member \
        ADD FOREIGN KEY (Di_id) REFERENCES dividend(Di_id)'
    conn.query(sqlMember, function (error, result) {
        if (error) throw error
        console.log('Added FK Di_id')
    })


    // Pm_id
    let sqlStaff = 'ALTER TABLE staff \
        ADD FOREIGN KEY (Pm_id) REFERENCES payment(Pm_id)'
    conn.query(sqlStaff, function (error, result) {
        if (error) throw error
        console.log('Added FK Pm_id')
    })


    // Mb_id, St_id
    let sqlPayment = 'ALTER TABLE payment \
    ADD FOREIGN KEY (Mb_id) REFERENCES member(Mb_id), \
    ADD FOREIGN KEY (St_id) REFERENCES staff(St_id)'
    conn.query(sqlPayment, function (error, result) {
        if (error) throw error
        console.log('Added FK Mb_id, St_id')
    })


    // St_id
    let sqlRice = 'ALTER TABLE rice \
            ADD FOREIGN KEY (St_id) REFERENCES staff(St_id)'
    conn.query(sqlRice, function (error, result) {
        if (error) throw error
        console.log('Added FK St_id')
    })


    // Mb_id, Rc_id
    let sqlDividend = 'ALTER TABLE dividend \
            ADD FOREIGN KEY (Mb_id) REFERENCES member(Mb_id), \
            ADD FOREIGN KEY (Rc_id) REFERENCES rice(Rc_id)'
    conn.query(sqlDividend, function (error, result) {
        if (error) throw error
        console.log('Added FK Mb_id, Rc_id')
    })
}

function connectTableAdmin() {
    let sql = 'CREATE TABLE IF NOT EXISTS admin (\
        Ad_id INT AUTO_INCREMENT, \
        Ad_user VARCHAR(250) NOT NULL, \
        Ad_pass VARCHAR(250) NOT NULL, \
        Ad_date VARCHAR(250), \
        PRIMARY KEY (Ad_id) \
    )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {

    })
}

function connectTableMember() {
    let sql = 'CREATE TABLE IF NOT EXISTS member (\
            Mb_id INT AUTO_INCREMENT, \
            Mb_fname VARCHAR(250), \
            Mb_lname VARCHAR(250), \
            Mb_email VARCHAR(250), \
            Mb_tel VARCHAR(10), \
            Mb_address TEXT, \
            Mb_date VARCHAR(250), \
            Di_id INT, \
            PRIMARY KEY (Mb_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
        console.log('Table member available')
    })
}

function connectTableStaff() {
    let sql = 'CREATE TABLE IF NOT EXISTS staff (\
            St_id INT AUTO_INCREMENT, \
            St_user VARCHAR(250) NOT NULL, \
            St_pass VARCHAR(250) NOT NULL, \
            St_fname VARCHAR(250), \
            St_lname VARCHAR(250), \
            St_address TEXT, \
            St_age VARCHAR(250), \
            St_salary VARCHAR(250), \
            St_position VARCHAR(250), \
            St_date VARCHAR(250), \
            Pm_id INT, \
            PRIMARY KEY (St_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
        console.log("Table staff Available")
    })
}

function connectTablePayment() {
    let sql = 'CREATE TABLE IF NOT EXISTS payment (\
            Pm_id INT AUTO_INCREMENT, \
            Pm_payments VARCHAR(10), \
            Pm_date VARCHAR(250), \
            Mb_id INT, \
            St_id INT, \
            PRIMARY KEY (Pm_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
        console.log("Table payment Available")
    })
}

function connectTableRice() {
    let sql = 'CREATE TABLE IF NOT EXISTS rice (\
            Rc_id INT AUTO_INCREMENT, \
            Rc_km VARCHAR(20), \
            Rc_sack VARCHAR(10), \
            RC_sum INT(10), \
            St_id INT, \
            PRIMARY KEY (Rc_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
        console.log("Table rice Available")
    })
}

function connectTableDividend() {
    let sql = 'CREATE TABLE IF NOT EXISTS dividend (\
            Di_id INT AUTO_INCREMENT, \
            Di_amount VARCHAR(10), \
            Mb_id INT, \
            Rc_id INT, \
            PRIMARY KEY (Di_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
        console.log("Table dividend Available")
    })
}

function connectTableRicePrice() {
    let sql = 'CREATE TABLE IF NOT EXISTS rice_pice(\
            Pr_id INT PRIMARY KEY AUTO_INCREMENT, \
            Pr_price VARCHAR(10) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
        console.log("Table rice price Available")
    })
}

connectDB()

module.exports.conn = conn