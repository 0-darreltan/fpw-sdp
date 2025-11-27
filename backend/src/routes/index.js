const userRouter = require('./userRoute');
const rabRouter = require("./rabRoute");
const projectRouter = require("./projectRoute");
const productRouter = require("./productRoute");
const orderRouter = require("./orderRoute");
const webhookRouter = require("./webhookRoute");
const materialRequestRouter = require("./materialRequestRoute");
const activityRouter = require("./activityRoute");
const cartRouter = require("./cartRoute");
const checkoutRouter = require("./checkoutRoute");
// const shippingRouter = require("./shippingRoute");

module.exports = {
  userRouter,
  rabRouter,
  projectRouter,
  productRouter,
  orderRouter,
  webhookRouter,
  materialRequestRouter,
  checkoutRouter,
  activityRouter,
  cartRouter,
  // shippingRouter,
};