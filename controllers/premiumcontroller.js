const Expenses = require("../models/expenses");
const GENERATEDREPORTS = require("../models/generatedreports");
const USERS = require("../models/user");
const AWS = require("aws-sdk");
async function showleaderboard(req, res, next) {
  try {
    const user = await USERS.find({}).sort({ createdAt: -1 }).exec()
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
}
async function downloadrep(req, res) {
  try {
    const exp = await Expenses.find({userId:req.user._id})
    const stringexp = JSON.stringify(exp);
    const userId = req.user._id;
    const filename = "Expense" + userId + "/" + new Date() + ".txt";
    const fileURl = await uploadToS3(stringexp, filename);
    await GENERATEDREPORTS.create({
      userId: userId,
      url: fileURl,
      filename: filename,
    });
    res.status(200).json({ fileURl, exp, success: true });  
  } catch (err){
    console.log(err)
    res.status(500).json({ message: "Something went wrong " });
  }
}
async function uploadToS3(data, filename) {
  try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    const response = await s3bucket.upload(params).promise();
    return response.Location;
  } catch (err){
    return err
  }
}
async function downgenerep(req, res) {
  try {
    const search = await GENERATEDREPORTS.find({ userId: req.user.id }).sort({ createdAt: -1 }).exec()
    res.status(200).json({ search, message: "list is here" });
  } catch {
    res.status(500).json({ message: "Something went wrong " });
  }
}
module.exports = { showleaderboard, downloadrep, downgenerep };
