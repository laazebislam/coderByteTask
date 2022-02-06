import DetectLanguage from "detectlanguage";
let wordCount = (str) => {
  return str.split(" ").filter(function (n) {
    return n != "";
  }).length;
};

let detectlanguage = new DetectLanguage("5a0052ba7d9c41ba0e6f63943dac6524");
let detectLang = async (txt) => {
  let data = await detectlanguage.detect(txt);
  return data[0].language == "fa" ? "ar" : data[0].language;
};
let flattenArr = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten
    );
  }, []);
};
let getMostRepeated = (arr) => {
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
};
export { wordCount, detectLang, flattenArr, getMostRepeated };
