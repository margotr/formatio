// //this should be linked to a database
// const bcrypt = require('bcrypt');
// const saltRounds = 10

// bcrypt.hash(yourPassword, saltRounds, (err, hash) => {
//     // Now we can store the password hash in db.
//     console.log(hash)
//     let pass = ''
//     bcrypt.compare(pass, hash, function(err, res) {
//         if (res == true) console.log('password matched')
//         else console.log('wrong password')
//       })
//   })

module.exports = class AccountManager {
    constructor() {
        //some database here

        this.accounts = []
    }
    addAccount() {
        let account = {
            username: 'guest', 
            score: 0, 
            session: createSessionID()
        }
        console.log("new account: ", account)
       this.accounts.push(account)
      return account
    }
    registerAccount(username, pass) {

    }
    getAccount(session) {
        return this.accounts.find(user => user.session === session)
    }
    getAccounts() {
        return this.accounts
    }
}

function createSessionID() {
    return '_' + Math.random().toString(36).substr(2, 9)
}