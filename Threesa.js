var path = require('path');
var express = require('express');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var connection = require('./connection');
var routes = require('./routes');
var multer = require('multer');
var cors = require('cors');
	
	
	
const gcm = require('node-gcm');
	const gcmKey = 'AIzaSyDsGTZrkH1GGadrgxG4aJsnDXJkpEHrUNY'; // Your gcm key in quotes
							//const deviceToken = regtokens // Receiver device token
							const sender = new gcm.Sender(gcmKey);
							var message = new gcm.Message();

/* var pdf = require('html-pdf');
var nunjucks = require('nunjucks');
var html = fs.readFileSync('./public/Customereceipt.html', 'utf8');
var loremhtml = fs.readFileSync('./lorem_tmpl.html', 'utf8'); */
var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'smtp.rediffmailpro.com'
    , port: 587
    , // secure: false, // use SSL
    auth: {
        user: 'support@deeptrack.in'
        , pass: 'Rudra@123'
    }
};

var fs = require('fs'),
    http = require('http'),
    https = require('https');
	
/* const fileUpload = require('express-fileupload'); */
//var upload = multer({ dest: './uploads' });
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './www/uploads');
    },
	
    filename: function (req, file, callback) {
        callback(null, 'img-' + Date.now()+file.originalname.replace(/ /g, "_"));
    }
});

var upload = multer({
    storage: storage
});

var app = express();
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb'}));
app.use(morgan('dev'));

/* exports.env = nunjucks.configure('public', {
    autoescape: true,
    express: app
}); */


app.use(cors());

app.post('/AddEmployee', upload.single('photo'), function (req, res, next) {

    if (req.file == 'undefined') {
        var myfilename = '';
    } else {
        if (req.file) {
            var myfilename = req.file.filename;
        } else {
            var myfilename = '';
        }
    }
    connection.acquire(function (err, con) {
        var sql = 'INSERT INTO `employeemaster`(`name`, `address`, `mobile1`, `mobile2`, `email`, `salary`, `joindate`, `dob`, `photo`, `createdby`) VALUES("'+req.body.name+'","'+req.body.address+'",'+req.body.mobile1+','+req.body.mobile2+',"'+req.body.email+'",'+req.body.salary+',"'+req.body.joindate+'","'+req.body.dob+'","'+myfilename+'",'+req.body.userid+')';
        con.query(sql, function (err, result){
		
			if (err) {
            con.release();
			
            return res.end('Something Went Wrong ! plaes try Again');
            
        } else {
			 if(req.body.username != ''&& req.body.password != '')
			 {
				 var str ='INSERT INTO `user`(`username`, `password`, `fullname`, `address`, `mobile1`, `mobile2`, `email`, `userlevel`, `supervisor`, `photo`,`empid`) VALUES ("'+req.body.username+'","'+req.body.password+'","'+req.body.name+'","'+req.body.address+'",'+req.body.mobile1+','+req.body.mobile2+',"'+req.body.email+'","'+req.body.userlevel+'",'+req.body.supervisor+',"'+myfilename+'",'+result.insertId+')'
				 con.query(str, function (err, resultuser){
					 if(err)
					 {
						 con.release();
					 }
				 else
				 {
					 con.release();
				 }
				 });
			 }
			 res.end('Employee Details Added Successfully');

        }
        })
        
    });
});



app.post('/UpdateEmployee', upload.single('photo'), function (req, res, next) {
    if (req.file == 'undefined') {
        var myfilename = req.body.photo;
    } else {
		connection.acquire(function (err, con) {
        if (req.file) {
            var myfilename = req.file.filename;
        } else {
            var myfilename = req.body.photo;
        }
		var sql1 = 'UPDATE `employeemaster` SET `name`="'+req.body.name+'",`address`="'+req.body.address+'",`mobile1`='+req.body.mobile1+',`mobile2`='+req.body.mobile2+',`email`="'+req.body.email+'",`salary`='+req.body.salary+',`joindate`="'+req.body.joindate+'",`dob`="'+req.body.dob+'",`photo`="'+myfilename+'" WHERE id ='+req.body.id;
		 con.query(sql1, function (err, result) {
			 console.log(sql1);
			 console.log(err);
			 if(err)
			 {con.release();}
			else
			{
				con.query('UPDATE `user` SET `fullname`="'+req.body.name+'",`address`="'+req.body.address+'",`mobile1`='+req.body.mobile1+',`mobile2`='+req.body.mobile2+',`email`="'+req.body.email+'",`userlevel`="'+req.body.userlevel+'",`username`="'+req.body.username+'",`password`="'+req.body.password+'",`supervisor`='+req.body.supervisor+',`photo`="'+myfilename+'" WHERE empid ='+req.body.id, function (err, result) {
					console.log(err);
					if(err)
					{
						con.release();
					}
					else
					{
						con.release();
					}
				})
			}
		 })
        
        res.end("Data Updated Successfully");
		});
    }
});


app.post('/api/photo',function(req,res){
	upload.array('userPhoto',2)(req,res,function(err) {
		var sql ='';
		if(req.files.length >0)
		{
		 connection.acquire(function (err, con) {
			 for(var i = 0 ; i < req.files.length;i++)
			 {
				 if(String(req.files[i].filename).substring( String(req.files[i].filename).indexOf("."),String(req.files[i].filename).indexOf(".")+5) == '.pdf')
				 {
					  sql = sql+'UPDATE employeemaster SET resume = "'+req.files[i].filename+'" WHERE id = '+req.body.random+';';
				 }
				 else
				 {
					   sql = sql +'UPDATE employeemaster SET aadhar = "'+req.files[i].filename+'" WHERE id = '+req.body.random+';';
				 }
			 }
        con.query(sql, function (err, result){
			if (err) {
            con.release();
            return res.end('Something Went Wrong');
            
        } else {
			 con.release();
		return res.end("Aadhar Card Uploaded Successfully");
        }
        })
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
		}
});
});


app.post('/AddProduct' ,upload.single('adv'),function (req, res, next) {
	if (req.file == 'undefined') {
        var adv = '';
    } else {
        if (req.file) {
            var adv = req.file.filename;
        } else {
            var adv = '';
        }
    }
    connection.acquire(function (err, con) {
        var sql = 'INSERT INTO `products`( `name`, `pack`,`weight`, `unit`,`description`,`distrate`, `retailerrate`,`taxpercent`,`cgst`,`sgst`, `mrp`,`adv`) VALUES ("'+req.body.prdname+'","'+req.body.pack+'",'+req.body.weight+',"'+req.body.unit+'","'+req.body.description+'",'+req.body.distrate+','+req.body.retailerrate+','+req.body.taxpercent+','+req.body.cgst+','+req.body.sgst+','+req.body.mrp+',"'+adv+'")';
        con.query(sql, function (err, result) {
			con.release();
        if (err) {
            
            console.log('Failed To Insert');
            
        } else {
            console.log('Data Inserted successfully');
        }
        })
		
        res.end("Data Inserted Successfully");
    });
});

function updateShortenLink(filename,id)
{
	var filenm = filename.replace(/\ /g,"_")
	var shortUrl = require('node-url-shortener');
	
	 // var advurl = 'http://lnadvertisement.000webhostapp.com/index.html?'+String(id);
	 

	var advurl = 'http://office.threesainfoway.net:8897/advfiles/CRMAdvertisement.html?'+String(id);
	try{
	shortUrl.short(advurl, function(err, url){
	// shortUrl.short(advurl, function(err, url){
		
		console.log(url);
				 connection.acquire(function (err, con) {
				 con.query('UPDATE `advertisment` SET `shortenurl` = ?,advfile=?  WHERE `id` = ?',[url,filenm,id], function (err, resultfinal) {
						if(err)
						{
							
							//res.end("Data Inserted Successfully");
						}
					else
					{
						//res.end("Data Inserted Successfully");
					}
			  });
			  });
	
			});
			
	 }
	 catch(ex)
	 {
		 console.log(ex);
	 }
	
}

app.post('/api/Advertisment',function(req,res){
	upload.array('advertisement',1)(req,res,function(err) {	 
	if (req.files.length <= 0) {
        var advertisement = req.body.oldfilename;
    } 	
    if (req.files.length > 0 ) {
           var advertisement = req.files[0].filename;
        }
		
		
    connection.acquire(function (err, con) {
        if(req.body.id == '')
		{
			
        con.query('INSERT INTO `advertisment`(`name`, `advfile`, `description`, `filename`, `createdby`) VALUES (?,?,?,?,?)',[req.body.name,req.body.name.replace(" ", "_")+'.html',req.body.description,advertisement,req.body.createdby], function (err, result) {
			
        if (err) {
            con.release();
            console.log('Failed To Insert');
            
        } else {
			
				var filecontent = '<!DOCTYPE html><html lang="en"><head><title>Threea Infoway Pvt. Ltd.</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><script src="../angulerjs/angular.min.js"></script><script src="../angulerjs/ui-bootstrap-tpls-0.14.3.min.js"></script><script src="../angulerjs/appAdv.js"></script></head><body ng-app="appAdv" ng-controller="AdvController" ng-init="GetAdvertisementDetails('+result.insertId+')"><div class="container"><div class="row"><center><img src="http://103.252.7.5:8897/uploads/'+advertisement+'" class="img-responsive"/><br><button class="btn btn-primary" data-toggle="modal" data-target="#myModalSendEnq">Send Inquiry</button></center></div><div class="modal fade" id="myModalSendEnq" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Submit Inquiry</h4></div><div class="modal-body"><form class="form-inline"><div class="form-group"><label for="customername">Name</label><input class="form-control" id="customername" ng-model="customer.customername" type="text"></div><div class="form-group"><label for="address">Address</label><textarea class="form-control" id="address" ng-model="customer.address"></textarea></div><div class="form-group"><label for="mobile">Mobile No</label><input class="form-control" id="mobile" ng-model="customer.mobile1" type="number"></div></form></div><div class="modal-footer"><button type="button" class="btn btn-success" ng-click="AddNewEnquiry()" data-dismiss="modal">Submit</button><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div></body></html>';
			var savedfilename = './www/advfiles/'+req.body.name.replace(/\ /g,"_")+'.html';
			var urlfilename = 'http://office.threesainfoway.net:8897/advfiles/'+req.body.name.replace(/\ /g,"_")+'.html';
			
			
			  updateShortenLink(urlfilename,result.insertId);
			
			var writeStream = fs.createWriteStream(savedfilename);
				writeStream.write(filecontent);
				writeStream.end();
			
						
					
        }
        });
        res.end("Data Updated Successfully");
		}
		
		if(req.body.id != '')
		{
			
			
			
        con.query('UPDATE `advertisment` SET `description` = ? ,`filename` = ? WHERE `id` = ?',[req.body.description,advertisement,req.body.id], function (err, result) {
			con.release();
        if (err) {
            
            console.log('Failed To Update');
            
        } else {
			
			var filecontent = '<!DOCTYPE html><html lang="en"><head><title>Bootstrap Example</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><script src="../angulerjs/angular.min.js"></script><script src="../angulerjs/ui-bootstrap-tpls-0.14.3.min.js"></script><script src="../angulerjs/appAdv.js"></script></head><body ng-app="appAdv" ng-controller="AdvController" ng-init="GetAdvertisementDetails('+req.body.id+')"><div class="container"><div class="row"><center><img src="http://103.252.7.5:8897/uploads/'+advertisement+'" class="img-responsive"/><br><button class="btn btn-primary" data-toggle="modal" data-target="#myModalSendEnq">Send Inquiry</button></center></div><div class="modal fade" id="myModalSendEnq" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Submit Inquiry</h4></div><div class="modal-body"><form class="form-inline"><div class="form-group"><label for="customername">Name</label><input class="form-control" id="customername" ng-model="customer.customername" type="text"></div><div class="form-group"><label for="address">Address</label><textarea class="form-control" id="address" ng-model="customer.address"></textarea></div><div class="form-group"><label for="mobile">Mobile No</label><input class="form-control" id="mobile" ng-model="customer.mobile1" type="number"></div></form></div><div class="modal-footer"><button type="button" class="btn btn-success" ng-click="AddNewEnquiry()" data-dismiss="modal">Submit</button><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div></body></html>';
			var savedfilename = './www/advfiles/'+req.body.name.replace(/\ /g,"_")+'.html';
			var urlfilename = 'http://office.threesainfoway.net:8897/advfiles/'+req.body.name.replace(/\ /g,"_")+'.html';
			
			updateShortenLink(urlfilename,req.body.id);
			
			var writeStream = fs.createWriteStream(savedfilename);
				writeStream.write(filecontent);
				writeStream.end();
							

        }
        });
        res.end("Data Updated Successfully");
		}
    }); 
	
});
});

app.post('/UpdateProducts', upload.single('adv'), function (req, res, next) {
    if (req.file == 'undefined') {
        var myfilename = req.body.adv.name;
    } else {
		connection.acquire(function (err, con) {
        if (req.file) {
            var myfilename = req.file.filename;
        } else {
            var myfilename = req.body.adv.name;
        }
		if(req.body.cgst == 'NaN')
		{
			var cgst = 0;
		}
		else
		{
			var cgst = req.body.cgst;
		}
		
		if(req.body.sgst == 'NaN')
		{
			var sgst = 0;
		}
		else
		{
			var sgst = req.body.cgst;
		}
		
		var taxpercent = parseFloat(cgst) + parseFloat(sgst);
		
		var sql = 'UPDATE `products` SET `name`="'+req.body.name+'",`pack`="'+req.body.pack+'",`weight` = '+req.body.weight+',`unit` = "'+req.body.unit+'",`description`="'+req.body.description+'",`distrate`='+req.body.distrate+',`retailerrate`='+req.body.retailerrate+',`taxpercent`='+taxpercent+',`mrp`='+req.body.mrp+',`cgst`='+cgst+',`sgst`='+sgst+',`adv`="'+myfilename+'" where id ='+ req.body.id;
		
		con.query(sql, function (err, result) {})
        if (err) {
            con.release();
            console.log('Failed To Updated Data');
        } else {
            console.log('Data Updated Successfully');
        }
        res.end("Data Updated Successfull");
		});
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('tokenSecret', 'secr3t');
app.use(express.static(path.join(__dirname, './www')));

app.get('/', function (req, res) {
    res.send('Hello! The API is up and running');
});


app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

connection.init();
routes.configure(app);
 var port = 8898;
 var server = https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
	   passphrase: 'admin'
    }, app).listen(port);
console.log('Server listening on port ' +port);
  
var io = require('socket.io').listen(server);

var socket1 = require( 'socket.io' );

var users = [];


var server1 = app.listen(8897, function () {
    console.log('Server listening on port ' + server1.address().port);
}); 

var userdetails = [];

var io1 = socket1.listen( server1 );
//Whenever someone connects this gets executed
 io.on('connection', function(socket){
  console.log('User Connected');
	io.emit('serverEvent','hello');
	
	socket.on('NewEnquiry', function(msg){
		io.emit('NewEnquiry', msg);
	});
	
	socket.on('NewCustomer', function(msg){
		io.emit('NewCustomer', msg);
	});
	
	socket.on('NewComplaint', function(msg){
		io.emit('NewComplaint', msg);
	});
	
	
	socket.on('LeaveEntry', function(leavedata){
		io.emit('LeaveEntry', leavedata);
	});
	
	socket.on('NewCollection', function(collectiondata){
		io.emit('NewCollection', collectiondata);
	});
	
	socket.on('Locationrequest', function(userid){
		io.emit('Locationrequest', userid);
		io1.sockets.emit('Locationrequest', userid);
	});
	
	
	socket.on( 'messagefromweb', function( data ) {
		io.emit('messagefromweb', { message: data.message,user:data.user,time:data.time } );
		io1.sockets.emit( 'message', { message: data.message,user:data.user,time:data.time } );
	});
	
	
	
	
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



app.post('/api/Location',function(req,res){
	
	
	console.log(req)
	
	
	});







io1.sockets.on( 'connection', function( client ) {
	/* console.log( "New client !"+client.handshake.sessionID);
	console.log("--------------------------------");
	console.log(client.handshake); */
	//console.log(client);
	

	client.on('NewEnquiry', function(msg){
		io1.sockets.emit('NewEnquiry', msg);
		io.emit('NewEnquiry', msg);
	});
	
	client.on('NewCustomer', function(msg){
		io1.sockets.emit('NewCustomer', msg);
		io.emit('NewCustomer', msg);
	});
	
	client.on('NewComplaint', function(msg){
		io1.sockets.emit('NewComplaint', msg);
		io.emit('NewComplaint', msg);
	});
	
	
	client.on('LeaveEntry', function(leavedata){
		io1.sockets.emit('LeaveEntry', leavedata);
		io.emit('LeaveEntry', leavedata);
	});
	
	client.on('NewCollection', function(collectiondata){
		io1.sockets.emit('NewCollection', collectiondata);
		io.emit('NewCollection', collectiondata);
		
	});
	
	client.on('Locationrequest', function(userid){
		console.log(userid)
		io1.sockets.emit('Locationrequest', userid);
		io.emit('Locationrequest', userid);
	});
	
	
	
	client.on( 'message', function( data ) {
		
		connection.acquire(function (err, con) {
			con.query('INSERT INTO `chatting`(`userid`, username,`message`, `msgtime`) VALUES (?,?,?,?)',[data.userid,data.username,data.message,data.time], function (err, result) {
				
				if(err)
				{
					console.log(err);
				}
				else
				{
					con.query('SELECT user.registrationid FROM user ', function (err, pushresult) {
				
				if(err)
				{
					console.log(err);
				}
				else
				{
					 var devicetokens = [];
												for(var i = 0 ; i < pushresult.length;i++)
												{
													if(pushresult[i].registrationid != null)
													{
														devicetokens.push(pushresult[i].registrationid);
													}
												}
							
									var msg = 'New Message from: '+data.username;
											message.addData({
											title: "",
											icon: "",
											body: msg,
										  otherProperty: true,
										});
							
										sender.send(message,devicetokens, (err,response) => {
										  if (err) {
											console.error(err);
										  }
										  else {
											
												
										  }
										});
								
								
							
				}
				con.release();
				});
				}
			});
		});
		io1.sockets.emit( 'message', { message: data.message,userid:data.userid,username:data.username,time:data.time } );
		io.emit('messagefromweb', { message: data.message,userid:data.userid,username:data.username,time:data.time } );
	});
	
	
	client.on( 'ReadContet', function( data ) {
		connection.acquire(function (err, con) {
			con.query('UPDATE `chatting` SET `readit`= 1 WHERE `userid` = ? AND chatting.`to` = ?',[data.touser,data.userid], function (err, result) {
				con.release();
				console.log(err)
				if(err)
				{
					console.log(err);
				}
				else
				{
					io1.sockets.emit( 'Readsuccess', { message: 'OK'} );
					
				}
			});
			});
		
	});
	
	client.on( 'Onetoonemessage', function( data ) {
		
		connection.acquire(function (err, con) {
			con.query('INSERT INTO `chatting`(`userid`,`to`,username,`message`, `msgtime`) VALUES (?,?,?,?,?)',[data.userid,data.touser,data.username,data.message,data.time], function (err, result) {
				
				if(err)
				{
					console.log(err);
				}
				else
				{
					
					
					con.query('SELECT user.registrationid FROM user WHERE user.id = '+data.touser, function (err, pushresult) {
				
				if(err)
				{
					console.log(err);
				}
				else
				{
					 var devicetokens = [];
												for(var i = 0 ; i < pushresult.length;i++)
												{
													if(pushresult[i].registrationid != null)
													{
														devicetokens.push(pushresult[i].registrationid);
													}
												}
							
									var msg = 'New Message from: '+data.username;
											message.addData({
											title: "",
											icon: "",
											body: msg,
										  otherProperty: true,
										});
							
										sender.send(message,devicetokens, (err,response) => {
										  if (err) {
											console.error(err);
										  }
										  else {
											
												 console.error(response);
										  }
										});
								
								
							
				}
				});
				con.release();
				}
			});
		});
		io1.sockets.emit( 'Onetoonemessage', { message: data.message,userid:data.userid,touserid:data.touser,username:data.username,time:data.time } );
		io.emit('Onetoonemessageweb', { message: data.message,userid:data.userid,touserid:data.touser,username:data.username,time:data.time } );
	});
	
});





server.timeout = 1000;
server1.timeout = 1000;