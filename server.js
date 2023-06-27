const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
require('dotenv').config({});

const app=express();
app.use(express.static("public"))
// to add the static files into the server that are present locally in our system 
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/",function(req,res){
    let firstname=req.body.fName;
    let lastname=req.body.lName;
    let email=req.body.email;
    let data={
        members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstname,
                LNAME: lastname
            }
        }
    ]
    };
    let jsonData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/79a510781f";
    const options={
        method: "POST",
        auth:  `varun_11:${process.env.API_KEY}`
    }
    const request = https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

    
})
app.post("/success",function(req,res){
    res.redirect("/");
    // it is redirected to app.get
})
app.post("/failure",function(req,res){
    res.redirect("/");
})
app.listen(3000,function(){
    console.log("Server is running");
});
