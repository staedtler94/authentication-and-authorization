var sqlite = require("sqlite3");
const crypto = require("crypto");
let exampleDB = null;

function setup() {
  exampleDB = new sqlite.Database(
    "example.db",
    sqlite.OPEN_READWRITE,
    (err) => {
      if (err) {
        return console.error(err.message);
      }

      console.log("sqlite database connected");
    }
  );
}

function test() {
  exampleDB;
}

function close() {
  exampleDB.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}

let sqlInsert =
  "INSERT INTO Users (userName, password, authorization) Values (?,?,?)";

function insertUsers(username, password) {
  return new Promise((resolve, reject) => {
    let cryPassword = createPasswordHash(password);
    console.log(cryPassword);
    let inputParams = [username, cryPassword, 1];

    exampleDB.run(sqlInsert, inputParams, function (err) {
      if (err) {
        console.log(err.message);
        return reject(err);
      }

      console.log(`A row has been inserted with rowid ${this.lastID}`);
      resolve(this.lastID);
    });
  });
}

function createPasswordHash(password){
    return crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
}

function checkUserCreds(username, password) {
  return new Promise((resolve, reject) => {

    //sql sanity check for userName like no ; or " as they cause sql injection attacks.
    let sqlGetUserDetails = `SELECT password from Users where userName = ?`;
    exampleDB.get(sqlGetUserDetails, username, function (err,row) {
        if(err){
            return reject({"status":"error","message":err.message});
        }

        if(row === undefined){
            return reject({"status":"user undefined", "message": "user is undefined"});
        }

        let cryPassword = createPasswordHash(password);

        if(row.password === cryPassword){
            return resolve("successful match");
        }else{
            return reject({"status":"password mismatch", "message": "password mismatch"})
        }
    });
  });
}

module.exports.setup = setup;
module.exports.close = close;
module.exports.insertUsers = insertUsers;
module.exports.userCreds = checkUserCreds;