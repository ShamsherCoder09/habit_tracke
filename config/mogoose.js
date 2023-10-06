const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mohdshamsher365:cYOoy7hfd6oDQpDH@cluster0.tzo1deq.mongodb.net/');

const db = mongoose.connection;

db.on('error',function(err){
    console.log('error in connecting to database',err);
});

db.once('open',function(){
    console.log('Sucessfully connected to database');
});

module.exports = db;
