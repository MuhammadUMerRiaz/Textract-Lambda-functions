const textractSDK = require("@aws-sdk/client-textract");
const TextractClient = textractSDK.TextractClient;
const AnalyzeExpenseCommand = textractSDK.AnalyzeExpenseCommand;
const textract = new TextractClient({ region: "eu-west-2" });
const AWS = require("aws-sdk");
const sns = new AWS.SNS();
exports.handler =  (event) => {
 
try {
 

  // var topic = event.Records[0].Sns.TopicArn;
   var message = event.Records[0].Sns.Message;
  
      var Textractparams = {
        Document: {
            S3Object: {
                Bucket: "readyfile-pending",
                Name: message
            }
        }
    };
        
  const cmd = new AnalyzeExpenseCommand(Textractparams);
  console.log('Start of textract')
  const d =  textract.send(cmd,(err, data) => {
  console.log('Start')
  if(err){ console.log('err->',err)}
  console.log(data.ExpenseDocuments[0]. SummaryFields);
  
  });
  
  
  console.log('Starting function SNS');


var params = {
    
    Message : JSON.stringify({
      'default' :  message,
      'APNS' : JSON.stringify({
        'aps' : { 
          "Bucket": "readyfile-pending",
            "Name": message
        },
      }),
     
    }),
    MessageStructure : 'json',
    TargetArn : 'arn:aws:sns:eu-west-2:009374030011:display-textract-data-analyze-expense',
  };





  console.log('Processing SNS');

    // sns.publish(params, function(err, data) {
    //     if (err) {
    //         console.log(err.stack);
    //         return;
    //     }
    //     console.log('push sent');
    //     console.log(data);
    // })
      
  
  console.log('Ending function SNS');
} catch(e) {
    console.log('error->')
    return {error: e.stack};
  }   
};

