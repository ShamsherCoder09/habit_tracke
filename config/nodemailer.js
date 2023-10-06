const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:({
        user:'krishna.coding.ninjas01@gmail.com',
        pass:'yixliqbhqxtalqxe'
    })
});

let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter:transporter,
    renderTemplate:renderTemplate
}