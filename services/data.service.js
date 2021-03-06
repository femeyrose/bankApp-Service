const db = require("./db");
//here we have imported the db


let details = {
  1001: { name: "user1", acno: 1001, pin: 1001, password: 1234, balance: 1000, transactions: [] },
  1002: { name: "user2", acno: 1002, pin: 1002, password: 1235, balance: 1000, transactions: [] },
  1003: { name: "user3", acno: 1003, pin: 1003, password: 1236, balance: 1000, transactions: [] },
  1004: { name: "user4", acno: 1004, pin: 1004, password: 1237, balance: 1000, transactions: [] },
  1005: { name: "user5", acno: 1005, pin: 1005, password: 1238, balance: 1000, transactions: [] },

}

let currentUser;

const register = (name, acno, pin, password) => {
  return db.User.findOne({
    acno
  })
    //findOne will find only one user, find will search all possible users

    .then(user => {//console.log(user);
      // result will be in this 'user'
      if (user) {
        return {
          status: false,
          statusCode: 422,
          message: "Account already exists. Please login"
        }
        //if we have user above msg will be printed
      }
      const newUser = new db.User({
        // for creating new account
        name,
        acno,
        pin,
        password,
        balance: 0,
        transactions: []
      });
      newUser.save();
      return {
        status: true,
        statusCode: 200,
        message: "Account created successfully"
        //after creating the new account this will appear in the mongodb
      }

    })
}
//it search the data from the db, and fetch the user with that acno
//.then is a promise in js for having asynchronous operation in js
//eg: setTimeout(function(){alert("hi")},5000)
//alert hi will display after 5 secs this is an asyn job
//same thing can be done using promises using .then

//eg: var promise = new Promise((resolve,reject)=>
// {setTimeout{function(){resolve()},5000}})




//   if (acno in details) {
//     return {
//       status: false,
//       message: "account num already exists. Please login"
//     }
//   }
//   //alert willn't work here
//   //we dont need 'this.details' here 

//   details[acno] = { name, acno, pin, password: pwd, balance: 0, transactions: [] }
//   // this.saveDetails();
//   return {
//     status: true,
//     message: "account created succesfully"
//   }
// }




//reg is an object this can be given any name
//this name is used to call in the index.js

const login = (req, acno1, password) => {
  var acno = parseInt(acno1);
  return db.User.findOne({
    acno: acno,
    password
    //we can also give simply acno as in register
  })

    .then(user => {
      //console.log(user);
      if (user) {
        req.session.currentUser = acno;
        //for checking the currentUser session for the remaining part(deposit,withdraw,transactions)
        return {
          status: true,
          statusCode: 200,
          message: "Logged In",
          name:user.name
        }
        //if we have user above msg will be printed
      }
      return {
        status: false,
        statusCode: 422,
        message: "Invalid credentials"
      }
    })
}


//   var data = details;
//   if (acno in data) {
//     var pwd = data[acno].password
//     if (pwd == password) {
//       req.session.currentUser = data[acno];
//       // this.saveDetails();
//       return {
//         status: true,
//         statusCode: 200,
//         message: "Logged in"
//       }
//     }

//   }
//   return {
//     status: false,
//     statusCode: 422,
//     message: "invalid credentials"
//   }
// }


const deposit = (req,acno, pin, amt) => {
  return db.User.findOne({
    acno: acno, 
    pin:pin,
    
  })
    .then(user => {
      if (!user) {
        return {
          status: false,
          statusCode: 422,
          message: "invalid account details"
        }
      }

      if(req.session.currentUser!=acno){
        return {
          status: false,
          statusCode: 422,
          message: "you are not allowed to make this transaction", 
        }
      }

      user.balance += parseInt(amt);
      user.transactions.push({
        amount: amt,
        typeOfTransaction: 'credit',
        id: Math.floor(Math.random() * 100000)
      });
      user.save();
      return {
        status: true,
        statusCode: 200,
        message: "credicted",
        balance: user.balance
      }

    })
}


//   var pin = parseInt(pin2)
//   var amt = Number(amt2)
//   var acno = acno2
//   let data = details;

//   if (acno in data) {
//     var pin1 = data[acno].pin

//     if (pin == pin1) {
//       data[acno].balance += amt
//       data[acno].transactions.push({
//         amount: amt,
//         type: 'Credicted',
//         id: Math.floor(Math.random() * 100000)
//         //to get the id (random value) for identifying each transactions
//         //math.floor to remove the decimal
//       })


//       // this.saveDetails();

//       return {
//         status: true,
//         statusCode: 200,
//         message: 'account has been credicted',
//         balance: data[acno].balance
//       }

//     }
//     else {
//       return {
//         message: 'invalid account'
//       }
//     }
//   }
// }

const withdraw = (req,acno, pin, amt) => {
  return db.User.findOne({
    acno: acno,
    pin:pin,
    
  })
  .then(user => {
    if (!user) {
      return {
        status: false,
        statusCode: 422,
        message: "invalid account details"
      }
    }
    if(req.session.currentUser!=acno){
      return {
        status: false,
        statusCode: 422,
        message: "you are not allowed to make this transaction", 
      }
    }
  if (user.balance < (amt)) {
    return {
      status: false,
      statusCode: 422,
      message: "insufficient balance",
      balance: user.balance
    }
  }
  user.balance -= parseInt(amt);
  user.transactions.push({
    amount: amt,
    typeOfTransaction: 'debit',
    id: Math.floor(Math.random() * 100000)
  });
  user.save();
  return {
    status: true,
    statusCode: 200,
    message: "debicted",
    balance: user.balance
  }
})

}
//   var pin = parseInt(pin2)
//   var amt = Number(amt2)

//   var acno = acno2
//   let data = details;

//   if (acno in data) {
//     var pin1 = data[acno].pin
//     if (data[acno].balance < amt) {
//       return {
//         status: false,
//         statusCode: 422,
//         message: 'insufficient balance',
//         balance: data[acno].balance
//       }
//     }

//     else if (pin == pin1) {

//       data[acno].balance -= amt
//       this.currentUser = data[acno]

//       data[acno].transactions.push({
//         amount: amt,
//         type: 'Debicted',
//         id: Math.floor(Math.random() * 100000)
//       })

//       //this.saveDetails();
//       return {
//         status: true,
//         statusCode: 200,
//         message: 'account has been debicted',
//         balance: data[acno].balance
//       }

//     }
//     else {
//       return {
//         message: 'invalid account'
//       }
//     }

//   }
// }



const getTransactions = (req) => {
  return db.User.findOne({
    acno: req.session.currentUser
     
  })
.then(user=>
  {
    return{
      status:true,
      statusCode:200,
      transactions:user.transactions
    }
  })
  //return details[req.session.currentUser.acno].transactions;
}
  

//session for a user should be done

const deleteTransaction = (req, id) => {
  return db.User.findOne({
    acno: req.session.currentUser  
  })

  .then(user=>{
    user.transactions=user.transactions.filter(t=>{
      if(t._id==id){
        return false
      }
      return true;
    })
    user.save();
    return {
      status:true,
      statusCode:200,
      message:'Transaction deleted successfully'
    }
  })


  // let transactions = details[req.session.currentUser.acno].transactions;
  // transactions = transactions.filter(t => {
  //   if (t.id == id) {
  //     return false;
  //   }
  //   // if id matches that transaction will be removed
  //   return true;
  // })
  // details[req.session.currentUser.acno].transactions = transactions;
  // //transactions are stored to the details after filtering

  // return {
  //   status: true,
  //   statusCode: 200,
  //   message: 'Transactions deleted successfully'
  // }
}
//filter operator in an array
//if t==id remove the session with that id eg:55001


module.exports = {
  reg: register,
  login,
  deposit,
  withdraw,
  getTransactions,
  deleteTransaction
}