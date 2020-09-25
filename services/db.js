const mongoose =require('mongoose')
//To include a module, use the require() function with the name of the module:

mongoose.connect('mongodb://localhost:27017/bank_server',
{useNewUrlParser:true,useUnifiedTopology: true});
//connecting to the db through mongoose
//27017 is a default port
//giving option useNewUrlParser:true bcz we are using new version of mongo
//To use the new parser, pass option { useNewUrlParser: true } to MongoClient. connect
//Parsing means analyzing and converting a program into an internal format that a runtime environment can actually run, for example the JavaScript engine inside browsers.
// The goal of the unified topology: - fully support the drivers Server Discovery and Monitoring, 
// Server Selection and Max Staleness specifications - reduce the maintenance burden of supporting the topology layer in the driver by modeling all supported topology types with a single engine
// remove confusing functionality which could be potentially dangerous for our users


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
//model name (User) will change to User given here (mongoose will plurarize the name by default as user, so it will come to know that it is a users collection )
//this user name is case sensitive
//model name normally starts with capital letter

module.exports={
    User
}
//created module export for user
//now onwards, we use this User for linking