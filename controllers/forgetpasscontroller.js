const Sib = require("sib-api-v3-sdk");
const Forgetpass = require("../models/forgetpasswordreq");
const USERS = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
async function resetpass(req, res) {
  try {
    const user = await USERS.findOne({ email: req.params.email });
    if (user) {
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "bmohit700@gmail.com",
      };
      const uuid = uuidv4();
      const receivers = [
        {
          email: req.params.email,
        },
      ];
      tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Reset your password from here",
        textContent:
          "We have requested to reset your password from expense tracker click on the below link to reset http://localhost:3000/password/resetpassword/" +
          uuid,
      });
      const done = await Forgetpass.create(
        {
          uuid: uuid,
          isactive: true,
          userId: user._id,
        }
      );
      if (done) {
        res.status(200).json({ message: "email sent " });
      }
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (err) {
    cosole.log(err)
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
async function uuidvalidater(req, res) {
  try {
    const id = req.params.uuid;
    const user = await Forgetpass.findOne({ uuid: id });
    if (user) {
      if (user.isactive == true) {
        res.sendFile(path.join(__dirname, "../", "/main", "/resetpass.html"));
      } else {
        console.log("err1")
        res.sendFile(path.join(__dirname, "../", "/main", "/404.html"));
      }
    } else {
      console.log("err2")

      res.sendFile(path.join(__dirname, "../", "/main", "/404.html"));
    }
  } catch (err) {
    console.log(err)

    res.status(500).json({ message: "Something went wrong " });
  }
}
async function createpass(req, res) {
  try {
    const uuid = req.body.uuid;
    var newpass = req.body.newpass;
    const user = await Forgetpass.findOne({ uuid: uuid });
    await user.updateOne({ isactive: false });
    const user1 = await USERS.findOne({ _id: user.userId } );
    const saltrounds = 10;
    const hashpass=await bcrypt.hash(newpass, saltrounds)
    await user1.updateOne({ password: hashpass });
      res.status(200).json({ message: "password changed successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong " });
  }
}
module.exports = { resetpass, uuidvalidater, createpass };
