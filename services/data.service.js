let details = {
    1001: { name: "user1", acno: 1001, pin: 1001, password: 1234, balance: 1000, transactions: [] },
    1002: { name: "user2", acno: 1002, pin: 1002, password: 1235, balance: 1000, transactions: [] },
    1003: { name: "user3", acno: 1003, pin: 1003, password: 1236, balance: 1000, transactions: [] },
    1004: { name: "user4", acno: 1004, pin: 1004, password: 1237, balance: 1000, transactions: [] },
    1005: { name: "user5", acno: 1005, pin: 1005, password: 1238, balance: 1000, transactions: [] },

}

let currentUser;

const register = (name, acno, pin, pwd) => {
    if (acno in details) {
        return {
            status: false,
            message: "account num already exists. Please login"
        }
    }
    //alert willn't work here
    //we dont need 'this.details' here 

    details[acno] = {name,acno,pin,password:pwd,balance: 0,transactions: [] }
    // this.saveDetails();
    return {
        status: true,
        message: "account created succesfully"
    }
}




//reg is an object this can be given any name
//this name is used to call in the index.js

const login= (acno1, password)=> {
    var acno = parseInt(acno1);
    var data = details;
    if (acno in data) {
        var pwd = data[acno].password
        if (pwd == password) {
            currentUser = data[acno];
            // this.saveDetails();
            return {
                status: true,
                statusCode:200,
                message: "Logged in"
            }
        }

    }
    return {
        status: false,
        statusCode:422,
        message:"invalid credentials"
    }
}


const deposit=(acno2, pin2, amt2)=> {
    var pin = parseInt(pin2)
    var amt = Number(amt2)

    var acno = acno2
    let data = details;

    if (acno in data) {
      var pin1 = data[acno].pin

      if (pin == pin1) {
        data[acno].balance += amt
        data[acno].transactions.push({
          amount: amt,
          type: 'Credicted'
        })
       
       // this.saveDetails();

        return {
          status: true,
          statusCode:200,
          message: 'account has been credicted',
          balance: data[acno].balance
        }

      }
      else {
        return {
          message: 'invalid account'
        }
      }
    }
  }

  const withdraw=(acno2, pin2, amt2)=> {
    var pin = parseInt(pin2)
    var amt = Number(amt2)

    var acno = acno2
    let data = details;

    if (acno in data) {
      var pin1 = data[acno].pin
      if (data[acno].balance < amt) {
        return {
          status: false,
          message: 'insufficient balance',
          balance: data[acno].balance
        }
      }

      else if (pin == pin1) {

        data[acno].balance -= amt
        this.currentUser = data[acno]

        data[acno].transactions.push({
          amount: amt,
          type: 'Debited'
        })

        //this.saveDetails();
        return {
          status: true,
          statusCode:200,
          message: 'account has been debicted',
          balance: data[acno].balance
        }

      }
      else {
        return {
          message: 'invalid account'
        }
      }

    }
  }



  const getTransactions=()=> {
    return details[currentUser.acno].transactions;
  }

//  const getDetails=()=> {
//     if (localStorage.getItem("details")) {
//       details = JSON.parse(localStorage.getItem("details"));
//     }

//        if (localStorage.getItem("currentUser")) {
//       currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     }
//   }





module.exports = {
    reg: register,
    login,
    deposit,
    withdraw,
    getTransactions
}