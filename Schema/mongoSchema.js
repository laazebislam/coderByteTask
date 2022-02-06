import { getMongooseCnx, getMongooseDocDB } from "../CallMeNigga.js";
import mongooseFuzzySearching from "mongoose-fuzzy-searching";

let initDocumentModel = () => {
  let db = getMongooseCnx();

  let schema = new db.Schema({
    text: { type: String, required: "Text is required!" },
    draft: { type: Boolean, default: true },
    submited: { type: Boolean, default: false },
    appreoved: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
  schema.plugin(mongooseFuzzySearching, { fields: ["text"] });
  return db.model("documents", schema);
};

let addText = async (text) => {
  let db = getMongooseDocDB();
  // adding text to db
  let sv = new db({ text });
  return sv.save({ text });
};
let editText = async ({ text, textId }) => {
  let db = getMongooseDocDB();
  return db.findOneAndUpdate({ _id: textId.toObjectId() }, { text });
};
let findText = async ({ limit, page }) => {
  // find text
  page = page - 1;
  let db = getMongooseDocDB();
  return db
    .find()
    .limit(limit)
    .skip(page * limit);
};
let findTextById = async (textId) => {
  // find text
  let db = getMongooseDocDB();
  return db.findOne({ _id: textId.toObjectId() });
};
let findMostUssedWord = async () => {
  // find text
  let db = getMongooseDocDB();
  return db.aggregate([
    {
      $addFields: {
        results: { $regexFindAll: { input: "$text", regex: /([^\s]+)/g } },
      },
    },
  ]);
};
let submitDoc = async (textId) => {
  // submitDoc
  let db = getMongooseDocDB();
  return db.findOneAndUpdate(
    {
      $and: [{ _id: textId.toObjectId() }],
      $or: [{ draft: true }, { rejected: true }],
    },
    { submited: true, draft: false, rejected: false }
  );
};
let approveDoc = async (textId) => {
  // approve deoc
  let db = getMongooseDocDB();
  return db.findOneAndUpdate(
    { _id: textId.toObjectId(), submited: true },
    { appreoved: true, submited: false }
  );
};
let rejectDoc = async (textId) => {
  // reject dox
  let db = getMongooseDocDB();
  return db.findOneAndUpdate(
    { _id: textId.toObjectId(), submited: true },
    { rejected: true, submited: false }
  );
};
let fuzzySearch = async (text) => {
  // find text
  let db = getMongooseDocDB();
  return db.fuzzySearch(text);
};
export {
  initDocumentModel,
  addText,
  findText,
  editText,
  findTextById,
  findMostUssedWord,
  fuzzySearch,
  submitDoc,
  approveDoc,
  rejectDoc,
};
