import { Router } from "express";
import { parse as QueryParse } from "qs";
import {
  addText,
  approveDoc,
  editText,
  findMostUssedWord,
  findText,
  findTextById,
  fuzzySearch,
  rejectDoc,
  submitDoc,
} from "../Schema/mongoSchema.js";
import { detectLang, flattenArr, getMostRepeated, wordCount } from "../Util.js";

let router = Router();

/* --- export for dependecy injection db --- */
let index = () => {
  // get all text
  router.get("/text", async (req, res) => {
    let { page = 1, limit = 5 } = QueryParse(req.query);
    try {
      let data = await findText({ limit, page });
      res.status(200).json({
        ok: "1",
        data,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });

  // search for most used word
  router.get("/text/mostOccurrent", async (req, res) => {
    try {
      let allWord = [];
      let a = await findMostUssedWord();
      a.map((x) => {
        let tempData = x.results.map((x) => x.captures);
        allWord.push(...flattenArr(tempData));
      });
      res.status(200).json({
        ok: "1",
        data: getMostRepeated(allWord),
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });

  // get text by id
  router.get("/text/:textId", async (req, res) => {
    try {
      let { textId } = req.params;
      let data = await findTextById(textId);
      res.status(200).json({
        ok: "1",
        data,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });

  // get count of words in text
  router.get("/text/:textId/count", async (req, res) => {
    try {
      let { textId } = req.params;
      let data = await findTextById(textId);
      res.status(200).json({
        ok: "1",
        data: wordCount(data.text),
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });
  // get count of words in text by language
  router.get("/text/:textId/count/:language", async (req, res) => {
    try {
      let { textId, language = "en" } = req.params;
      let data = await findTextById(textId);
      let textFiltred = [];
      // detect language of every word using API then split them
      await Promise.all(
        data.text
          .split(" ")
          .filter((x) => x != "")
          .map(async (x) => {
            let lng = await detectLang(x);
            lng == language ? textFiltred.push(x) : "";
          })
      );
      res.status(200).json({
        ok: "1",
        data: textFiltred.length,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });
  // add text to database
  router.post("/text", async (req, res) => {
    let { text } = req.body;
    try {
      await addText(text);
      res.status(200).json({
        ok: "1",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });
  // edit text in DB bu ID
  router.put("/text/:textId", async (req, res) => {
    let { text } = req.body;
    let { textId } = req.params;
    try {
      await editText({ text, textId });
      res.status(200).json({
        ok: "1",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });
  // fuzzy search from db
  router.post("/text/search", async (req, res) => {
    let { q } = QueryParse(req.query);
    try {
      let data = await fuzzySearch(q);
      res.status(200).json({
        ok: "1",
        data,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });
  // status of documents
  router.post("/text/:textId/status", async (req, res) => {
    let { submit, approve, reject } = req.body;
    let { textId } = req.params;
    try {
      let data;
      if (submit) {
        data = await submitDoc(textId);
      } else if (approve) {
        data = await approveDoc(textId);
      } else if (reject) {
        data = await rejectDoc(textId);
      }
      res.status(200).json({
        ok: data ? "1" : "0",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        ok: "0",
      });
    }
  });
  return router;
};

export default index;
