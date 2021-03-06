const express = require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
require("./db/conn");
const Register=require("./models/registers");
const port=process.env.PORT || 4000;

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})
//create new user in our database
app.post("/register",async(req,res)=>{
    try {
        const registerEmployee=new Register({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        })
        const registered=await registerEmployee.save();
        res.status(201).render("index");
    } catch (error) {
        res.status(400).send(error);
        
    }
   
})

//login validation

app.post("/login",async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        console.log(`${email} and ${password}`);

        const useremail=await Register.findOne({email:email});
        if(useremail.password===password)
        {
            res.status(201).render("index");
        }else{
            res.send("Incorrect Credentials");
        }
        
        
    } catch (error) {
        res.status(400).send("Invalid Credentials");
        
    }
})


app.listen(port,()=>{
    console.log(`server is running at port number ${port}`);
})