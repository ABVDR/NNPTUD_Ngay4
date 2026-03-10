var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')
const { default: slugify } = require('slugify');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let result = await productModel.find({isDeleted: false}) 
  res.send(result);
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      isDeleted: false,
      _id: id
    })
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      }),
      price: req.body.price || 0,
      description: req.body.description || "",
      images: req.body.images || ["https://i.imgur.com/ZANVnHE.jpeg"],
      category: req.body.category
    });
    await newProduct.save();
    res.send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let updateData = {};
    if (req.body.title) {
      updateData.title = req.body.title;
      updateData.slug = slugify(req.body.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      });
    }
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.images) updateData.images = req.body.images;
    if (req.body.category) updateData.category = req.body.category;

    let result = await productModel.findByIdAndUpdate(id, updateData, { new: true });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (result) {
      res.send({ message: "Product deleted successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
