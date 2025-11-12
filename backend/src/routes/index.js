const userRouter = require('./userRoute');
const rabRouter = require("./rabRoute");
const proposalRouter = require("./proposalRoute");
const projectRouter = require("./projectRoute");
const productRouter = require("./productRoute");
const orderRouter = require("./orderRoute");
const paymentRouter = require("./paymentRoute");
const webhookRouter = require("./webhookRoute");

module.exports = {
  userRouter,
  rabRouter,
  proposalRouter,
  projectRouter,
  productRouter,
  orderRouter,
  paymentRouter,
  webhookRouter,
};