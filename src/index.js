const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

const products = [];

app.use(express.json());

function existProduct(req, res, next) {
  const { name } = req.query;

  const product = products.find((product) => product.name === name);

  if (!product) {
    return res.status(400).json({ error: 'product does not exist' });
  }

  req.product = product;

  return next();
}

app.post('/products', (req, res) => {
  const { name, description, img, price } = req.body;

  const checkProductExist = products.some((product) => product.name === name);

  if (checkProductExist) {
    return res.status(409).json({ error: 'Existing Product' });
  }

  products.push({ id: uuidv4(), name, description, img, price });

  return res.status(201).send();
});

app.get('/products', (req, res) => {
  return res.json(products);
});

app.get('/products/search', existProduct, (req, res) => {
  const { name } = req.query;
  const { product } = req;

  return res.status(201).json(product);
});

app.put('/products', existProduct, (req, res) => {
  const { price } = req.body;
  const { product } = req;

  product.price = price;

  return res.status(201).send();
});

app.patch('/products', existProduct, (req, res) => {
  const { url, id } = req.body;
  const { product } = req;

  const newUrl = product.img.find((imgID) => imgID.id === id);

  if (!newUrl) {
    return res.status(404).send();
  }

  newUrl.url = url;

  return res.status(201).json({ true: 'funfando' });
});

app.delete('/products', existProduct, (req, res) => {
  const { product } = req;

  products.splice(product, 1);

  return res.status(201).send();
});

app.listen(PORT, () => {
  console.log(`Porta utilizada http://localhoste:${PORT}`);
});
