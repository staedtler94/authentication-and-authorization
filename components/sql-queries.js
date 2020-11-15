module.exports.queries = {
  "auth-table-creation": `CREATE TABLE Persons (
        userID integer Primary Key AUTOINCREMENT,
        userName varchar(100) NOT NULL,
        password varchar(256) NOT NULL,
        authorization int NOT NULL
    ); `,

};
