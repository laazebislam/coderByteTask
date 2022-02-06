import express from "express";
import morgan from "morgan";
import compression from "compression";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { mongoDbUrl } from "./Config.js";
import { setMongooseCnx, setMongooseDocDB } from "./CallMeNigga.js";
import { addText, initDocumentModel } from "./Schema/mongoSchema.js";
import index from "./Routes/index.js";

/* --- option of mongoose connection ---*/
let ops = {
  a: mongoDbUrl,
  b: { useNewUrlParser: true, useUnifiedTopology: true },
};
// a sample hack to not wast time
String.prototype.toObjectId = function () {
  var ObjectId = mongoose.Types.ObjectId;
  return new ObjectId(this.toString());
};
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.disable("x-powered-by");
if (process.env.NODE_ENV == "production") {
  app.use(compression());
} else {
  app.use(morgan("dev"));
}
let doWork = async () => {
  await mongoose.connect(ops.a, ops.b).catch((err) => console.error(err));
  setMongooseCnx(mongoose);
  setMongooseDocDB(initDocumentModel());
  app.use("/", index());
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  let port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`app listening bb on port: ${port} process: ${process.pid}`);
  });
};
doWork();
