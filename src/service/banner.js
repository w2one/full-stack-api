/**
 * create table dict(
	id int,
    parentId int,
	valueCn varchar(50) collate utf8_unicode_ci,
	valueEn varchar(50) collate utf8_unicode_ci, 
	description varchar(150) collate utf8_unicode_ci,
	createTime date,
	updateTime date
);
 */

// var mysql = require("mysql");
// var connection = mysql.createConnection({
//   host: "106.13.32.89",
//   port: "8002",
//   user: "root",
//   password: "11112222",
//   database: "trash"
// });

// connection.connect();

export function getBanner(ctx) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * from banner", function(error, results, fields) {
      if (error) throw error;
      resolve(results);
    });
  });
}

export function addBanner(ctx) {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into dict banner(2,0,'名字','name1','姓名啊1',"2019-7-3","2019-7-3")`,
      function(error, results, fields) {
        if (error) throw error;
        //   console.log("The solution is: ", results[0]);
        //   ctx.body = JSON.stringify(results);
        //   resolve(results);
        resolve(results);
      }
    );
  });
}
