let mongooseCnx, documentDb;
let setMongooseCnx = (db) => (mongooseCnx = db);
let getMongooseCnx = () => mongooseCnx;
let setMongooseDocDB = (db) => (documentDb = db);
let getMongooseDocDB = () => documentDb;
export { getMongooseCnx, setMongooseCnx, setMongooseDocDB, getMongooseDocDB };
