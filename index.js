const express= require('express');
//this is like import module in the front end (note: 'express' defined in the brackets is the module)
//express server is created

const dataService =require('./services/data.service');


const app =express();
//created the application for express

app.use(express.json());

//app.listen(3000);
//listen(3000) is a port to run the application, we can give any port number

//now to define the router
// app.get('/',(req,res)=>{
//     res.send("hello world 2 after connecting to the router")
// })
//if this works in the browser means router works

// '/' is the default router, 2nd parameter is the call back fn with (resquest, response) 
// now this can be seen in the browser (using get fn)
// call back fn- fn called in the future, which (fn) is passed in other fn
//a fn which is called in another fn as an argument
//get is a fn in the express, we can pass like

// app.get('/',()=>{
//     console.log("hello world 2 after connecting to the router")
// })

//here every time the browser runs this will be printed in the cmd


// app.listen(3000, ()=>
// {console.log("server started at port 3000")});
// call back function, the app fn will have a nameless fn which will perform the console.log("server started at port 3000") in the cmd


// console.log("hello world")

// note: here console.log will appear only in the terminal (backend) not in the browser console
// we get only 'cannot get' error in the browser (localhost:3000), this means the module is linked with the browser
//note: for every change we have to run node.js again

//if the router is not started, then we get 'cannot get' error in the browser
// to test APIs (app protocol interface) we use postman
//to communicate the express and angular we use an interface (API) we can test these APIs in the postman




//http verbs/http methods

//post - to create data (like to create users, transactions) we use post
//get- to fetch/read any data (when browser is run, get is called, only get fn is called)
//in get, will return data to the router ('/')

//put- update or replace
//patch- update or replace, but partial update
//delete-to delete

//REST-representational state transfer

//these http verbs/http methods are used in the postman
//all other fns other than get can be seen only in postman



app.get('/',(req,res)=>{
    res.send("hello world ")
})


// app.get('/',(req,res)=>{
//     res.status(401).send("hello world ")
// })

//we get unauthorized error in the  browser console

// app.post('/',(req,res)=>{
//     res.send("post")
// })



//we have defined name,acno,pin,password in the body of postman
//for the first 'send' in postman the above details will be added (message:account created succesfully)
//in the second send "acc already exists" message will appear
//since we have not stored in local storage, every after server  restart
//data will be lost
//to see this in the postman  give, "http://localhost:3000/register"

app.post('/register',(req,res)=>{
    const result=dataService.reg(req.body.name,req.body.acno,req.body.pin,req.body.password)
    res.send(result.message)
})

// app.post('/login',(req,res)=>{
//     const result=dataService.login(req.body.acno,req.body.password)
//     res.send(result.message)
// })

app.post('/login',(req,res)=>{
    const result=dataService.login(req.body.acno,req.body.password)
    //res.json(result)
    res.status(result.statusCode).json(result);
    
})

//now the response can be seen as json by using 'res.json(result)'
// like return {
//     status: false,
//     statusCode:422,
//     message:"invalid credentials"
// }

// this will 'res.status(result.statusCode).json(result)'
//show the status 422-unprocessable entity in the 'status' section of postman

app.post('/deposit',(req,res)=>{
    const result=dataService.deposit(req.body.acno,req.body.pin,req.body.amt)
    res.status(result.statusCode).json(result);
    
})

app.post('/withdraw',(req,res)=>{
    const result=dataService.withdraw(req.body.acno,req.body.pin,req.body.amt)
    res.status(result.statusCode).json(result);
    
})

app.get('/transactions',(req,res)=>{
    const result=dataService.getTransactions();
    res.status(200).json(result);
    
})


app.put('/',(req,res)=>{
    res.send("put")
})

app.patch('/',(req,res)=>{
    res.send("patch")
})

app.delete('/',(req,res)=>{
    res.send("delete method")
})

//here we have used the same url ('/') to run all the verbs


app.listen(3000, ()=>
{console.log("server started at port 3000")});
// in normal case, listen will be given last, bcz these works in milli secs
//the router may not get the data within that time if we given above all the methods


//note without using the 
// app.listen(3000, ()=>
// {console.log("server started at port 3000")});
// will not work since the port will not open

//npm i -g nodemon
//every time after any changes we have to stop and then restart (node index.js) the server
//to avoid this we install the above nodemon
//now to run the TYPE in cmd nodemon index.js
//now no need to stop and start (nodemon server will restart and up the server)
