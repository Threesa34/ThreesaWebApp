var mysql = require('mysql');
 var mysqlDump = require('mysqldump');
 
function Connection() {
  this.pool = null;
 
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 100,
	  multipleStatements: true,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'threesa'
    });
  };
  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
  
  
    mysqlDump({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'threesa',
    dest:'www/files/ThreesaDataBaseBackup.sql' // destination file 
},function(err){
    // create data.sql file; 
})
  
}
 
module.exports = new Connection();