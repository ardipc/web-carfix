require('dotenv').config();

var express = require('express');
var router = express.Router();

var Db = require('../configs/database');
var TProducts = Db.extend({tableName: "products"});

var multer = require('multer');
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/assets/images/product')
	},
	filename: (req, file, cb) => {
		var pecah = file.originalname.split('.');
		var ekstension = pecah[pecah.length-1];
		cb(null, 'product-'+Date.now()+'.'+ekstension)
	}
})
var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  var mProducts = new TProducts();
	mProducts.find((err, rows, fields)=>{
		res.render('products-index', {dataProducts: rows});
	})
});

router.get('/index', (req, res, next)=>{
	var mProducts = new TProducts();
	mProducts.find((err, rows, fields)=>{
		res.render('products-index', {dataProducts: rows});
	})
})

router.get('/form', (req, res, next)=>{
	var formData = {
		id: '',
		title: '',
    description: '',
    file: '',
    product_type: '',
		action: process.env.URL_HOST+'products-backend/add',
	};
	res.render('products-form', {formData: formData})
})

router.get('/form/:id', (req, res, next)=>{
	var mProducts = new TProducts();
	mProducts.find('all', {where: "id = '"+req.params.id+"'"}, (err, rows, next)=>{
		var formData = {
			id: rows[0].id,
			title: rows[0].title,
      description: rows[0].description,
      file: rows[0].file,
      product_type: rows[0].product_type,
			action: process.env.URL_HOST+'products-backend/update',
		};
		res.render('products-form', {formData: formData})
	})
})

router.post('/add', upload.single('file'), (req, res, next)=>{
	var formData = {
		title: req.body.title,
    description: req.body.description,
    file: req.file.filename,
    product_type: req.body.product_type,
	};

	var mProducts = new TProducts(formData);
	mProducts.save((err, rows, fields)=>{
		if(err) throw new Error(err);
		res.redirect('/products-backend/index');
	});
})

router.post('/update', upload.single('file'), (req, res, next)=>{
	var formData = {
		id: req.body.id,
		title: req.body.title,
		description: req.body.description,
    file: req.file.filename,
    product_type: req.body.product_type,
	};

	var mProducts = new TProducts();
	var sql = "UPDATE products SET title = '"+formData.title+"', description = '"+formData.description+"', file = '"+formData.file+"', product_type = '"+formData.product_type+"' WHERE id = '"+formData.id+"'";
	mProducts.query(sql, (err, rows, fields)=>{
		if(err) throw new Error(err);
		res.redirect('/products-backend/index');
	});
})

router.get('/remove/:id', (req, res, next)=>{
	var mProducts = new TProducts();
	mProducts.remove("id = '"+req.params.id+"'", (err, result)=>{
		if(err) throw new Error(err);
		res.redirect('/products-backend/index');
	})
})


router.get('/api/all', (req, res, next)=>{
	var mProducts = new TProducts();
	mProducts.find((err, rows, fields)=>{
		if(err) throw new Error(err)
		res.json(rows)
	})
})

module.exports = router;
