var path = require('path');
var express = require('express');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken'); 
var morgan = require('morgan');
var connection = require('./connection');
var routes = require('./routes');
var multer	=	require('multer');;
var fs = require('fs');
var bodyParser = require('body-parser');
var pdf = require('html-pdf');
var nunjucks = require('nunjucks');
/* var html = fs.readFileSync('./public/nunjucks.tmpl.html', 'utf8'); */
var html = fs.readFileSync('./public/AurachakraReport.html', 'utf8');
var loremhtml = fs.readFileSync('./lorem_tmpl.html', 'utf8');
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



var app = express();
app.use(bodyparser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyparser.json({limit: '50mb'}));
app.use(morgan('dev'));


//var upload = multer({ dest: './uploads' });
var storage	=	multer.diskStorage({
 destination: function (req, file, callback) {
    callback(null, './www/uploads');
 },
 filename: function (req, file, callback) {
//	console.log(file);
   callback(null, 'dt-'+Date.now()+'-'+file.originalname);
  }
});
var upload = multer({ storage : storage});//.single('file');



//Nunjucks is a product from Mozilla and we are using it as a template engine.
exports.env = nunjucks.configure('public', {
    autoescape: true,
    express: app
});

var port = process.env.port || 8394;
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





// Add headers for CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


var server = app.listen(port, function() {
  console.log('Server listening on port ' + server.address().port);
});







app.post('/api/printpdf1', function (req, res) {
    console.log('request made....print 1 ');
	var reportdetails = req.body[0];
	console.log(reportdetails);
	console.log(pdf);
	console.log("============================================");
	if( reportdetails.photo == 'dt-1501567978578-Blank-image.png' && reportdetails.gender == 'female')
	{
		reportdetails.photo = "profile-pic-dummy.jpg";
	}
	if( reportdetails.photo == 'dt-1501567978578-Blank-image.png' && reportdetails.gender == 'male')
	{
		reportdetails.photo = "default-pic.png";
	}
	if(reportdetails.totalscore == 0 && reportdetails.totalscore < 10 )
	{
		reportdetails.scorimg = "round-img-old1.png";
	}
	if(reportdetails.totalscore >= 10 && reportdetails.totalscore < 20 )
	{
		reportdetails.scorimg = "round1.png";
	}
	if(reportdetails.totalscore >= 20 && reportdetails.totalscore < 30 )
	{
		reportdetails.scorimg = "round2.png";
	}
	if(reportdetails.totalscore >= 30 && reportdetails.totalscore < 40 )
	{
		reportdetails.scorimg = "round3.png";
	}
	if(reportdetails.totalscore >= 40 && reportdetails.totalscore < 50 )
	{
		reportdetails.scorimg = "round4.png";
	}
	if(reportdetails.totalscore >= 50 && reportdetails.totalscore < 60 )
	{
		reportdetails.scorimg = "round5.png";
	}
	if(reportdetails.totalscore >= 60 && reportdetails.totalscore < 70 )
	{
		reportdetails.scorimg = "round6.png";
	}
	if(reportdetails.totalscore >= 70 && reportdetails.totalscore < 80 )
	{
		reportdetails.scorimg = "round7.png";
	}
	if(reportdetails.totalscore >= 80 && reportdetails.totalscore < 90 )
	{
		reportdetails.scorimg = "round8.png";
	}
	if(reportdetails.totalscore >= 90 && reportdetails.totalscore < 100 )
	{
		reportdetails.scorimg = "round9.png";
	}
	
	if(reportdetails.totalscore >= 100 && reportdetails.totalscore <= 100 )
	{
		reportdetails.scorimg = "round10.png";
	}
	if(reportdetails.gender == 'female')
	{
		reportdetails.malefemaleimg = 'Chakra-diseage-woman.png';
	}
	if(reportdetails.gender == 'male')
	{
		reportdetails.malefemaleimg = 'Chakra-diseage-man.png';
	}
	
	if(reportdetails.time != '00:00:00am')
	{
		reportdetails.time = reportdetails.time;
	}
	else
	{
		reportdetails.time = ""
	}
	
	var str = new Date(); 
    var dd = str.getDate();
    if(dd < 10)
    dd = '0'+dd;
    var mm = str.getMonth() + 1;
    if(mm < 10)
    mm = '0'+mm;
    var yy = str.getFullYear();
    var hh = str.getHours();
    var min = str.getMinutes();
    var sec = str.getSeconds();
     str2 = yy+'-'+mm+'-'+dd+'-'+hh+'-'+min+'-'+sec;
	 
	var mypath = 'pdffiles/'+str2+'Client_Details_and_Aura_Report_of_'+reportdetails.customer_name+'.pdf';
	//var mypath1 = 'pdffiles/'+str2+'Aura_Report_of_'+reportdetails.customer_name+'.pdf';
    var today = new Date();
   /*  var obj = {
        date: today,
        data : reportdetails,
    }; */

	var obj1 = {
        date: today,
        data : reportdetails,
    };
	
    //var renderedHtml =  nunjucks.render('nunjucks.tmpl.html',obj);
    var renderedHtml1 =  nunjucks.render('AurachakraReport.html',obj1);
	var options = { format: 'Letter' };
		
   /*  pdf.create(renderedHtml,options).toStream(function(err, stream){
        console.log(stream);
        stream.pipe(res);
    });  */
	console.log("--------");
	console.log(pdf);
	console.log("-------")
	
	pdf.create(renderedHtml1).toStream(function(err, stream){
		console.log(err);
		console.log(stream);
		
		if(mypath != undefined)
		stream.pipe(fs.createWriteStream(mypath));
	});
	
/* 	pdf.create(renderedHtml1).toStream(function(err, stream){
		if(mypath1 != undefined)
		stream.pipe(fs.createWriteStream(mypath1));
	}); */
	console.log(mypath);
	res.send(mypath);

	var mailtext ='Dear '+reportdetails.fren_name+' \n\n\n You have received a new Aura Chakra Report from "'+reportdetails.customer_name+'". Please find the attachment of Client details and his/her Aura Chakra Report.\n\n Login details for your recommendation panel are as below: \n\n URL: admin.aurachakra.in \n\n Username: '+reportdetails.f_username+'   \n\n Password: '+reportdetails.f_password+'	\n\n\n Best Wishes, \n The Aura Chakra Team.';
	
	 var myint = setInterval(function(){
		var mailTransport = nodemailer.createTransport(smtpConfig);
		var mailOptions = {
			from: "Aura Chakra <aurachakra@rudracentre.com ",
			to: reportdetails.fren_email,
			cc: reportdetails.alt_email,
			subject: "Chakra Report from "+reportdetails.customer_name,
			text: mailtext,
			attachments: [
				{          
					path: mypath
				},
				 /* {   
						path: mypath1
				}  */
			]
		};
		
		mailTransport.sendMail(mailOptions, function (error, info) {
			if (error) {
				return console.log(error);
			}
			
			
			else
			{
				console.log(" Congratulations Mail sent from deeptrack developped  application----" + info.response);
			
				var data = String(info.response).substring(0, 6);
				console.log(data);
			var io = require('socket.io').listen(server);
					io.on('connection', function(socket){
									socket.on('clientEvent', function(data){
									console.log("-----------------");
									console.log(data);
									console.log("-----------------");
									io.sockets.emit('serverEvent', data);
		
	});
					});

						
			}
			
			
		});
		 
		clearInterval(myint);
	},7000);  
});


app.get('/api/printpdf2', function (req, res) {
   
    pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
		if (err) return console.log(err);
		console.log(res);
    });
     
	 

 /*
    console.log('request made.... print 2 ');
    pdf.create(loremhtml).toBuffer(function(err, buffer){
        console.log('This is a buffer:', Buffer.isBuffer(buffer));
        res.download(buffer);
    });
*/
});

app.get('/api/getsampledataforreport',function(req,res){
    var data = {
        applications:[
            {id:1, app:'Cite'},
            {id:2, app:'Crash'},
            {id:3, app:'Vault'},
            {id:4, app:'Crime'}
        ]
    };
    res.json(data);
});

app.post('/upload_data', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.body);
  if(req.body.file==='')
  {
	if(!req.body.mobile)  {
		req.body.mobile=0;
	}
	if(!req.body.time)  {
		req.body.time=0;
	}
	if(!req.body.currentcity)  {
		req.body.currentcity=null;
	}
	if(!req.body.countryname)  {
		req.body.countryname=0;
	}
	if(!req.body.statename)  {
		req.body.statename=0;
	}
	if(!req.body.cityname)  {
		req.body.cityname=0;
	}
console.log(req.body);
  connection.acquire(function(err, con) {
  	 var sql = 'insert into customerdetails(customer_name,email,mobile,gender,currentcity,countrynamecurrent,franchiesid,dob,time,countryname,statename,cityname,concerns,details,handed) values ("'+req.body.customer_name+'","'+req.body.email+'",'+req.body.mobile+',"'+req.body.gender+'","'+req.body.cityid+'","'+req.body.countrynamecurrent+'",'+req.body.franchiesid+',"'+req.body.dob+'","'+req.body.time+'",'+req.body.countryname+','+req.body.statename+','+req.body.cityname+',"'+req.body.concerns+'","'+req.body.details+'","'+req.body.handed+'")';
     con.query(sql, function(err, result) {
		 console.log(err);
		 console.log(sql);
        if (err) {
			con.release();
          console.log('Image Upload failed');
        } else {
			console.log('Image Upload successfully');
		}
	/* 	console.log(result);
		console.log(err);	 */
		res.send(result);
		res.end("File is uploaded-");
	 })
  });
    }  else
  { 
if(!req.body.mobile)  {
		
		req.body.mobile=0;
	}
	if(!req.body.time)  {
		req.body.time=0;
	}
	if(!req.body.currentcity)  {
		req.body.currentcity=null;
	}
	if(!req.body.countryname)  {
		req.body.countryname=0;
	}
	if(!req.body.statename)  {
		req.body.statename=0;
	}
	if(!req.body.cityname)  {
		req.body.cityname=0;
	}
	 connection.acquire(function(err, con) {
		 console.log(req.body.franchiesid);
  	 var sql = 'insert into customerdetails(customer_name,email,mobile,gender,currentcity,countrynamecurrent,photo,franchiesid,dob,time,countryname,statename,cityname,concerns,details,handed) values ("'+req.body.customer_name+'","'+req.body.email+'",'+req.body.mobile+',"'+req.body.gender+'","'+req.body.currentcity+'","'+req.body.countrynamecurrent+'","'+req.file.filename+'",'+req.body.franchiesid+',"'+req.body.dob+'","'+req.body.time+'",'+req.body.countryname+','+req.body.statename+','+req.body.cityname+',"'+req.body.concerns+'","'+req.body.details+'","'+req.body.handed+'")';
     con.query(sql, function(err, result) {
		 console.log(err);
		 console.log(sql);
        if (err) {
			con.release();
          console.log('Image Upload failed');
        } else {
			console.log('Image Upload successfully');
		}
		console.log(err);
		console.log(result);
		console.log(err);
		res.send(result);
		res.end("File is uploaded");
	 })
  });
  } 
/* res.end("File is uploaded"); */
});

  app.post('/upload_pdf', upload.array(), function (req, res, next) {
   
  console.log(req.body);
  console.log(req.id);
  
  imageData = imageData.Replace("data:application/pdf;base64,", "");
 // byte[] bytes = Convert.FromBase64String(imageData);
console.log(req.imageData);
  console.log(req.id);
 
  });
  
app.post('/uploadvendorproduct', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.body);
  console.log(req.file.filename);
  console.log(req.body.categoryid);
  console.log(req.body.productname)
  console.log(req.body.price);
  console.log(req.body.packing);
   console.log(req.body.vendoridadmin);
  
 
  connection.acquire(function(err, con) {
  	 var sql = 'insert into products(categoryid,productname,price,packing,imagename,vendorid) values ('+req.body.categoryid+',"'+req.body.productname+'",'+req.body.price+',"'+req.body.packing+'","'+req.file.filename+'",'+req.body.vendoridadmin+')';
	 console.log(sql);
     con.query(sql, function(err, result) {
		 console.log(err);
        if (err) {
			con.release();
          console.log(' Upload failed');
        } else {
			console.log(' Upload successfully');
		}
		console.log(result);
		
		console.log(err);
	 })
  });

  res.end("File is uploaded");
});
app.post('/uploadcategory', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  //console.log(req.body);
  console.log(req.file.filename);
  console.log(req.body.parentcategoryid);
  console.log(req.body.categoryname)
  
  connection.acquire(function(err, con) {
  	 var sql = 'insert into categories(categoryname,imagename,parentcategoryid) values ("'+req.body.categoryname+'","'+req.file.filename+'",'+req.body.parentcategoryid+')';
     con.query(sql, function(err, result) {
		 console.log(err);
        if (err) {
			con.release();
          console.log('Image Upload failed');
        } else {
			console.log('Image Upload successfully');
		}
		console.log(result);
	 })
  });

  res.end("File is uploaded");
});
/* edit */
app.post('/uploadCategories', upload.single('file'), function (req, res, next) {
    console.log();
    if (req.file == 'undefined') {
        var myfilename = '';
    } else {
        console.log("file defined");
        if (req.file) {
            var myfilename = req.file.filename;
			var sql = 'update categories set imagename = "' + myfilename + '" ,categoryname = "'+ req.body.categoryname +'",parentcategoryid = "'+ req.body.parentcategoryid +'" where categoryid = "'+ req.body.categoryid +'"';
        } else {
            var sql = 'update categories set categoryname = "'+ req.body.categoryname +'",parentcategoryid = "'+ req.body.parentcategoryid +'" where categoryid = "'+ req.body.categoryid +'"';
        }
    }
    console.log("filename=  "+myfilename);
    console.log("categoryname name:=  "+req.body.categoryname);
    console.log("parentcategoryid=  "+ req.body.parentcategoryid);
    console.log("categoryid=  "+req.body.categoryid);
    connection.acquire(function (err, con) {
        
        con.query(sql, function (err, result) {})
        if (err) {
            con.release();
            console.log(err);
            console.log('Image Upload failed');
        } else {
            console.log('Image Upload successfully');
        }
        res.end("File is uploaded");


    });
});
/* edit product */
app.post('/updateproductedit', upload.single('file'), function (req, res, next) {
	console.log("categoryid name:=  "+req.body.imagename);
    console.log("00990099");
    if (req.file == 'undefined') {
        var myfilename = '';
    } else {
        console.log("file defined");
        if (req.file) {
            var myfilename = req.file.filename;
			 var sql = 'update products set imagename = "' + myfilename + '" ,categoryid = "'+ req.body.categoryid +'",productname = "'+ req.body.productname +'",tax = "'+ req.body.tax +'",price = "'+ req.body.price +'",discountpcnt = "'+ req.body.discountpcnt +'",discountamt = "'+ req.body.discountamt +'",packing = "'+ req.body.packing +'" where productid = "'+ req.body.productid +'"';
			 console.log(sql);
        } else{
			var sql = 'update products set categoryid = "'+ req.body.categoryid +'",productname = "'+ req.body.productname +'",tax = "'+ req.body.tax +'",price = "'+ req.body.price +'",discountpcnt = "'+ req.body.discountpcnt +'",discountamt = "'+ req.body.discountamt +'",packing = "'+ req.body.packing +'" where productid = "'+ req.body.productid +'"';
		}
    }
    console.log("---------------------------------------------------------------------");
    console.log("filename=  "+myfilename);
    console.log("categoryid name:=  "+req.body.categoryid);
    console.log("productname=  "+ req.body.productname);
	console.log("tax= "+ req.body.tax);
	console.log("price=  "+ req.body.price);
	console.log("discountpcnt=  "+ req.body.discountpcnt);
	console.log("discountamt=  "+ req.body.discountamt);
	console.log("imagename= "+ req.body.imagename );
	console.log("packing=  "+ req.body.packing);
    console.log("productid=  "+req.body.productid);
    connection.acquire(function (err, con) {
       
        con.query(sql, function (err, result) {})
        if (err) {
            con.release();
            console.log(err);
            console.log('Image Upload failed');
        } else {
            console.log('Image Upload successfully');
        }
        res.end("File is uploaded");


    });
});
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('tokenSecret', 'secr3t');
app.use(express.static(path.join(__dirname, './www')));

app.get('/', function(req, res) {
	res.send('Hello! The API is up and running');
});


connection.init();
routes.configure(app);


