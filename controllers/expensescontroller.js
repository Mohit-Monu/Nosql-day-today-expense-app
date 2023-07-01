const expenses = require("../models/expenses");
const USERS = require("../models/user");
async function addexpense(req, res) {
  try {
    const amount = req.body.amt;
    const description = req.body.des;
    const category = req.body.cat;
    const id = req.user.id;
    await expenses.create(
      {
        expenseamount: amount,
        category: category,
        description: description,
        userId: id,
      }
    );
    const user = await USERS.findOne({ _id: id });
    const exp = user.total_exp;
    await user.updateOne({ total_exp: exp + amount / 1 });
    res.status(200).json({ message: "expenses uploaded" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
async function loadexpense(req, res) {
  try{
    var page = req.params.page;
    page = page / 1;
    var limit = req.params.limit || 5;
    limit = limit / 1;
    const noofex = await expenses.find({ userId: req.user.id });
    const noofexp=noofex.length
    const skip=(page-1)*limit
    const search = await expenses.find({userId: req.user.id }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec()
    const user1 = await USERS.findOne({ _id: req.user.id } );
    res.status(202).json({
      result: search,
      user: user1,
      pagination: {
        lastpage: Math.ceil(noofexp / limit),
      },
    }); 
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
async function delexpenses(req, res) {
  try {
    const id1 = req.params.id;
    var amount = 0;
    const deletedExpense = await expenses.findOne({ _id: id1 });
    amount = deletedExpense.expenseamount;
    await deletedExpense.deleteOne();
    const user = await USERS.findOne({ _id: req.user.id});
    const exp = user.total_exp;
    await user.updateOne({ total_exp: exp - amount / 1 });
    res.status(200).json({ message:"deleted" });
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
module.exports = { addexpense, loadexpense, delexpenses };
