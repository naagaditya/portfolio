// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const uuidV1 = require('uuid/v1');
exports.handler = async (event, context, callback) => {
  // Set the region 
  AWS.config.update({ region: 'ap-south-1' });

  let transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    auth: {
      user: 'AKIAIVFY5YMSYDXJEPYA', // generated ethereal user
      pass: 'AnNNa4VtLa5e4rduMX4Er3gBJXzuJUlKx6Myn4iEkLAa' // generated ethereal password
    },
    secure: true
  });

  var ddb;
  // Create the DynamoDB service object
  ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
  var params = {
    TableName: 'Users',
    Item: {
      'id': { S: uuidV1() },
      'name': { S: event.name },
      'email': { S: event.email },
      'phone': { S: event.phone },
      'message': { S: event.message },
      "timestamp": { S: new Date().toString() },
    }
  };
  let mailOptions = {
    from: `"${event.name}" <hello@adityanaag.me>`, // sender address
    to: 'adityanaag91@gmail.com', // list of receivers
    subject: `${event.email}`, // Subject line
    text: `name: ${event.name}\n email: ${event.email}\n phone: ${event.phone}\n message: ${event.message}\n`, // plain text body
    html: `name: ${event.name}<br> email: ${event.email}<br> phone: ${event.phone}<br> message: ${event.message}` // html body
  };
  const sendMail = () => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        context.done(error);
        return;
      }
      console.log('Message sent: %s', info.messageId);
      callback(null, {
        statusCode: 200,
        body: "added in db and Mail sent"
      });
      context.succeed('done 2');
    });
  }
  sendMail();
  ddb.putItem(params, function (err, data) {
    if (err) {
      context.done(err);
    } else {
      context.succeed('done 1');
    }
  });
  context.succeed = (response) => { console.log(response) };

};
