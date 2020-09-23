const mongoose =require('mongoose')

mongoose.connect('mongodb://localhost:27017/bank_server',
{useNewUrlParser:true});
//connecting to the db through mongoose
//27017 is a default port
//giving option useNewUrlParser:true bcz we are using new version of mongo

const User = mongoose.model('User',{
    name: String,
    acno: Number,
    pin: Number,
    password: String,
    balance: Number,
    transactions:[{
        amount: Number,
        typeOfTransaction: String
    }]
});

//we have created users collections in mongo for this we created a model for this as above (user)
//model name will change to User given here (mongoose will plurarize the name by default as user, so it will come to know that it is a users collection )
//this user name is case sensitive
//model name normally starts with capital letter

module.exports={
    User
}
//created module export for user
//now onwards, we use this User for linking