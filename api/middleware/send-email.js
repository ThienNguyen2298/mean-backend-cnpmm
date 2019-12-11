const nodemailer = require('nodemailer');


let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'namquangdinh98@gmail.com',
        pass: 'easy2getroom.tlcn'
    }
});

const message = {
    from: 'TTN Shop', // Sender address
    to: 'quangnamute.98@gmail.com',         // List of recipients
    subject: 'Confirm your order from TTN Shop', // Subject line
    html: '<h3>Click the link below to confirm your order</h3><p><a href="facebook.com">Link</a></p>'
};

module.exports = (mailInfo) => {
    message.to = 'quangnamute.98@gmail.com';
    message.html = '<h3>Click here to confirm your order</h3><p><a href="' + 'facebook.com' + '">Link Confirm</a></p>'
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}