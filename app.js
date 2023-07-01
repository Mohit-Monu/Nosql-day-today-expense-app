require("dotenv").config();
const express=require('express')
const path=require('path')
const cors=require('cors');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const userRoutes=require('./routes/users')
const expensesRoutes=require('./routes/expenses')
const orderRoutes=require('./routes/purchase')
const premiumRoutes=require('./routes/premium')
const forgetpassRoutes=require('./routes/forgetpass')
const app=express()
app.use(cors())
app.use(express.json()); 
app.use(express.static(path.join(__dirname,"public"))); 
app.use(bodyParser.urlencoded({ extended: false  }));
app.use(userRoutes);
app.use(expensesRoutes);
app.use(orderRoutes);
app.use(premiumRoutes);
app.use(forgetpassRoutes);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,"main/"+req.url))
})
mongoose.connect(process.env.MONGODB)
.then((res)=>{
    app.listen(process.env.PORT);
}).catch((err)=>{
    console.log(err);
})