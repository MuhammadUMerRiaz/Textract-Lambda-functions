const textractSDK = require("@aws-sdk/client-textract");
const TextractClient = textractSDK.TextractClient;
const AnalyzeExpenseCommand = textractSDK.AnalyzeExpenseCommand;

const textract = new TextractClient({ region: "eu-west-2" });
const AWS = require("aws-sdk");
var sqs = new AWS.SQS({region: 'eu-west-2'});
const sns = new AWS.SNS();

exports.handler = (event) => {
 
  try {
 

    
    var SQSparams = {
        QueueName: 'AmazonTextract-Pending-Queue'
      };
      
      sqs.getQueueUrl(SQSparams, function (err, data) {
      if (err) 
      {
      console.log("Error", err);
      } 
      else 
      {
      console.log('Message initialization of the user!!')
     
      const message = 
      {
        "sender": "User",
        "activity": 'AnalyzeExpense API',
        "params": {
            "Document": {
            "S3Object": {
                Bucket: "readyfile-pending",
                Name: event.fileLocation 
            }
        }
        },
        "time": new Date().toISOString(),
      }
       
      var SQSQueryparams = 
      {
      MessageBody: JSON.stringify(message),
      QueueUrl: data.QueueUrl
        };
        
     console.log("Parameter for Enqueing Textract ", SQSQueryparams);
     
     sqs.sendMessage(SQSQueryparams, function(err, data) {
      if (err) {
      console.log("Error", err);
      } else {
      console.log("Success Message ID", data.MessageId);
      }});
     
    
      }
      })
    
      
       

  
  console.log('Starting function SNS');


 var params = {
    
     Message : JSON.stringify({
      'default' :  event.fileLocation,
      'APNS' : JSON.stringify({
        'aps' : { 
           "Bucket": "readyfile-pending",
            "Name": event.fileLocation 
        },
      }),
     
    }),
    MessageStructure : 'json',
    TargetArn : 'arn:aws:sns:eu-west-2:009374030011:dequeuing-textract-analyze-expense',
  };






    sns.publish(params, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }
        console.log('push sent');
        console.log(data);
    })
      
      
      
      
      

  console.log('End of textract')
  } catch(e) {
    console.log('error->')
    return {error: e.stack};
  }
};
