const express= require('express');
//this is like import module in the front end (note: 'express' defined in the brackets is the module)
//express server is created (we have imported the 'express' module here)

const dataService =require('./services/data.service');

const session =require('express-session');
//express session is installed (npm i express-session) and declared here
//express-session is imported here
//the session is like local storage in front end 
const cors= require('cors');
const app =express();
//created the application for express

app.use(cors ({
    origin:'http://localhost:4200',
    credential:true
}))

// cors is istalling to the server
// we are allowing the cookies now
//after this only the register page (in 4200 will redirect to the login page)




app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
}));
//after installing and initializing session,we have to use this (ie after npm i express-session and const session =require('express-session'))
//multiple users can be handled after using the sessions, ie, multiple users can use the application
//after each session/modifications the sessions will be forcefully saved
//using resave (only for modifications, the sessions need to be saved, ie, we set is as false)
//the one with Uninitialized will not be saved (saveUninitialized:false)
//secret:'randomsecurestring'---id will be created (key will be used to sign) for the session,ie, secure string
//now the sessions are enabled
//session can store any data eg:currentUser (req.session.currentUser)



app.use(express.json());
// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
// This method is called as a middleware in your application using the code: app.use(express.json());

const logMiddleware=(req,res,next)=>{
    console.log(req.body);
    next();
}

//order is important, after app.use(express.json()) this only 
// const logMiddleware=(req,res,next)=>{
//     console.log(req.body);
//     next();
// } is defined


app.use(logMiddleware);
//here this is an application wide middle ware, it will affect full apllication
//ie, it will also effect for all routers that we defined (register,login,deposit,withdraw,transactions etc)


const authMiddleware=(req,res,next)=>{
    if(!req.session.currentUser){
        return res.status(401).json({ 
         status: false,
         statusCode: 401,
         message: "please login",
        });  
        //return res.status(401).json will provide the status code 401 in the status section of postman
        //user should not be allowed to deposit before login
        //when the user tries to deposit without login, we get above 401 unauthorized error
     }
     else{
         next();
         //route to next router when the if condition is false (ie, if we have session currentUser)
     }
};
//now the session is enabled
//now after defining the session, with all requests we add sessions (req.session)
//authmiddle ware is a router wide middle ware, 
//for register and login routers,we don't need for other routers, so this is not an application wide middle ware

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
    dataService.reg(req.body.name,req.body.acno,req.body.pin,req.body.password)
.then (result=>{
    //result will be in 'result',
    res.status(result.statusCode).json(result);
})
//this after db linking

    // const result=dataService.reg(req.body.name,req.body.acno,req.body.pin,req.body.password)
    // res.send(result.message)
})

// app.post('/login',(req,res)=>{
//     const result=dataService.login(req.body.acno,req.body.password)
//     res.send(result.message)
// })

app.post('/login',(req,res)=>{
    dataService.login(req,req.body.acno,req.body.password)
    //const result=dataService.login(req,req.body.acno,req.body.password)
    //res.json(result)
    .then (result=>{
    res.status(result.statusCode).json(result);
    
})
})

//request is also passed in the login , to save details (like local storage)

//now the response can be seen as json by using 'res.json(result)'
// like return {
//     status: false,
//     statusCode:422,
//     message:"invalid credentials"
// }

// this will 'res.status(result.statusCode).json(result)'
//show the status 422-unprocessable entity in the 'status' section of postman

app.post('/deposit',authMiddleware,(req,res)=>{
    //console.log(req.session.currentUser);
    //the saved user session can be seen in cmd
    dataService.deposit(req.body.acno,req.body.pin,req.body.amt)
   
    //const result=dataService.deposit(req.body.acno,req.body.pin,req.body.amt)
    
    .then(result=>{
        res.status(result.statusCode).json(result);
    })   
})

app.post('/withdraw',authMiddleware,(req,res)=>{
    //console.log(req.session.currentUser);
    dataService.withdraw(req.body.acno,req.body.pin,req.body.amt)
    
    //const result=dataService.withdraw(req.body.acno,req.body.pin,req.body.amt)
    
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
      
})

app.get('/transactions',authMiddleware,(req,res)=>{
    //console.log(req.session.currentUser);
    dataService.getTransactions(req)

    //const result=dataService.getTransactions(req);
    //res.status(200).json(result);
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
});

app.delete('/transactions/:id',authMiddleware,(req,res)=>{ 
    dataService.deleteTransaction(req,req.params.id)
    //const result=dataService.deleteTransaction(req,req.params.id)
    //console.log(req.query.id);
    //passing as id

    // console.log(req.query.randomId);
    //passing as random id

    // console.log(req.params.id);
    // passing as url parameter

    //res.status(200).json(result);
    .then(result=>{
        res.status(200).json(result);
    });
})
//in delete fn also we need authMiddleware otherwise anyone can delete the transactions




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
