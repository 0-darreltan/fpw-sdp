const userRouter = require('./userRoute');
const rabRouter = require("./rabRoute");
const proposalRouter = require("./proposalRoute");
const projectRouter = require("./projectRoute");
const productRouter = require("./productRoute");
const orderRouter = require("./orderRoute");
const webhookRouter = require("./webhookRoute");
const materialRequestRouter = require("./materialRequestRoute");

module.exports = {
  userRouter,
  rabRouter,
  proposalRouter,
  projectRouter,
  productRouter,
  orderRouter,
  webhookRouter,
  materialRequestRouter,
};