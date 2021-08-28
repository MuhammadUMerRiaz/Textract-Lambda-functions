//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Textract.html#analyzeExpense-property
//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-textract/interfaces/analyzeexpensecommandinput.html
const textractSDK = require("@aws-sdk/client-textract");
const TextractClient = textractSDK.TextractClient;
const AnalyzeExpenseCommand = textractSDK.AnalyzeExpenseCommand;
const textract = new TextractClient({ region: "eu-west-2" });
const AWS = require("aws-sdk");
exports.handler = async (event) => {
 
  try {
    var params = {
        Document: {
            S3Object: {
                Bucket: "readyfile-pending",
                Name: event.fileLocation
            }
        }
    };
    const cmd = new AnalyzeExpenseCommand(params);
    const data = await textract.send(cmd)/*.promise()*/;
    let summaries = data.ExpenseDocuments[0].SummaryFields;
   
    return { reference: event.fileLocation};
  } catch(e) {
    return { reference: event.fileLocation, error: e.stack};
  }
};
