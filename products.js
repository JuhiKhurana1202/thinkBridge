const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: 'string',
    description: 'string',
    price: Number,
    image: 'string',
});
const Products = mongoose.model('products', schema);
module.exports = Products