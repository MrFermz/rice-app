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
            console.log(error)
            setTimeout(connectDB, 2000)
        }
        conn.query("CREATE DATABASE IF NOT EXISTS " + mDatabase + " CHARACTER SET utf8 COLLATE utf8_general_ci", async function (error, result) {
            console.log("Database Available")
            await connectTable()

            // Add FK
            await connectForeignKey()
        })
    })

    // AUTO RESTART
    conn.on('error', function (error) {
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

    // Mb_id, St_id
    let sqlPayment = 'ALTER TABLE payment \
            ADD FOREIGN KEY (Mb_id) REFERENCES member(Mb_id), \
            ADD FOREIGN KEY (St_id) REFERENCES staff(St_id), \
            ADD FOREIGN KEY (Ad_id) REFERENCES admin(Ad_id)'
    conn.query(sqlPayment, function (error, result) {
        if (error) throw error
    })

    // St_id
    let sqlRice = 'ALTER TABLE rice \
            ADD FOREIGN KEY (St_id) REFERENCES staff(St_id), \
            ADD FOREIGN KEY (Ad_id) REFERENCES admin(Ad_id)'
    conn.query(sqlRice, function (error, result) {
        if (error) throw error
    })

    // Mb_id
    let sqlDividend = 'ALTER TABLE dividend \
            ADD FOREIGN KEY (Mb_id) REFERENCES member(Mb_id)'
    conn.query(sqlDividend, function (error, result) {
        if (error) throw error
    })

}

function connectTableAdmin() {
    let sql = 'CREATE TABLE IF NOT EXISTS admin (\
        Ad_id INT(10) AUTO_INCREMENT, \
        Ad_user VARCHAR(250) NOT NULL, \
        Ad_pass VARCHAR(250) NOT NULL, \
        Ad_date VARCHAR(50), \
        PRIMARY KEY (Ad_id), \
		UNIQUE (Ad_user) \
    )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

function connectTableMember() {
    let sql = 'CREATE TABLE IF NOT EXISTS member (\
            Mb_id INT(10) AUTO_INCREMENT, \
            Mb_fname VARCHAR(250), \
            Mb_lname VARCHAR(250), \
            Mb_email VARCHAR(50), \
            Mb_tel VARCHAR(30), \
            Mb_address TEXT, \
            Mb_date VARCHAR(50), \
            PRIMARY KEY (Mb_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

function connectTableStaff() {
    let sql = 'CREATE TABLE IF NOT EXISTS staff (\
            St_id INT(10) AUTO_INCREMENT, \
            St_user VARCHAR(250) NOT NULL, \
            St_pass VARCHAR(250) NOT NULL, \
            St_fname VARCHAR(250), \
            St_lname VARCHAR(250), \
            St_address TEXT, \
            St_age INT(10), \
            St_salary VARCHAR(10), \
            St_position VARCHAR(20), \
            St_date VARCHAR(50), \
            PRIMARY KEY (St_id), \
			UNIQUE (St_user) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

function connectTablePayment() {
    let sql = 'CREATE TABLE IF NOT EXISTS payment (\
            Pm_id INT(10) AUTO_INCREMENT, \
            Pm_payments VARCHAR(10), \
            Pm_date VARCHAR(50), \
            Mb_id INT(10), \
            St_id INT(10), \
            Ad_id INT(10), \
            PRIMARY KEY (Pm_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

function connectTableRice() {
    let sql = 'CREATE TABLE IF NOT EXISTS rice (\
            Rc_id INT(10) AUTO_INCREMENT, \
            Rc_kg VARCHAR(20), \
            Rc_sack VARCHAR(10), \
            Rc_sum INT(10), \
            RC_date VARCHAR(50), \
            St_id INT(10), \
            Ad_id INT(10), \
            PRIMARY KEY (Rc_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

function connectTableDividend() {
    let sql = 'CREATE TABLE IF NOT EXISTS dividend (\
            Di_id INT(10) AUTO_INCREMENT, \
            Di_year VARCHAR(50), \
            Di_num FLOAT(10), \
            Mb_id INT(10),\
            PRIMARY KEY (Di_id) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

function connectTableRicePrice() {
    let sql = 'CREATE TABLE IF NOT EXISTS rice_price(\
            Pr_id INT(10) PRIMARY KEY AUTO_INCREMENT, \
            Pr_price VARCHAR(10) \
        )ENGINE=InnoDB DEFAULT CHARSET=utf8'
    conn.query(sql, function (error, result) {
        if (error) throw error
    })
}

connectDB()

module.exports.conn = conn