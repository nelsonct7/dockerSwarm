const mongoose = require('mongoose');
const fs = require('fs')
require("dotenv").config();

const dbUrl=process.env.DB_URL || fs.readFileSync(process.env.DATABASE_URL_FILE, 'utf8');

const connectToDb=async(cb)=>{
    console.log("[!] DB URL ",dbUrl);
    try{
        await mongoose.connect(dbUrl)
        cb(dbUrl)
    }catch(error){
        console.log("[!] Failed to connect to db server ",error);
        throw error
    }
}


module.exports={
    connectToDb
}