const mongoose = require('mongoose');



exports.db = ()=>{
    mongoose.connect('mongodb+srv://mohdshamsher365:cYOoy7hfd6oDQpDH@cluster0.tzo1deq.mongodb.net/' , {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    })
    .then(()=>{ console.log("Database is Connected") })
    .catch((err)=>{
         console.log("Database is not Connected")
         console.log(err)
        
        })
}
