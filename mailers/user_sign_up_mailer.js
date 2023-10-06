const nodemailer = require('../config/nodemailer');

module.exports.signUp = function(user){
    let htmlString  = nodemailer.renderTemplate({user:user},'/sign_up/sign_up_mailer.ejs');
    nodemailer.transporter.sendMail({
        from:'krishna.coding.ninjas01@gmail.com',
        to:user.email,
        subject:'Leading To Wealthy Life',
        html:htmlString
    },function(err,info){
        if(err){
            console.log('error in sending mail',err);
        }
        console.log('meessage sent',info);
    }
    
    )
}