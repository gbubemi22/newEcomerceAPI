const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
      name: {
          type: String,
          trim: true,
          required: [true, 'Please provide  product name'],
          maxlength: [100, 'Name can not be more than 100 Words'],
      },
      price: {
          type: Number,
          required: [true, 'Please provide product price'],
          default: 0,
      },
      description: {
          type: String,
          required: [true, 'Please provide product description'],
          maxlength: [1000, 'Description can not be more than 1000 characters'],
      },
      image: {
          type: String,
          default: '/uploads/example.jpeg',
      },
       category: {
           type: String,
           required: [true, 'Please provide product category'],
           enum: ["office","kitchen", "bedroom"],
       },
       company: {
           type: String,
           required: [true, 'please provide company'],
           enum: {
               values: ['ikea', 'liddy', 'marcos'],
               message: '{VALUE} is not supported',
           },

       },
       colors: {
           type: [String],
           default: ['#222'],
           required: true,
       },
       freeShipping: {
           type: Boolean,
           default: false,
       },
       inventory: {
           type: Number,
           required: true,
           default: 15,
       },
       averageRating: {
           type: Number,
           default: 0,
       },
       numOfReviews: {
           type: Number,
           default: 0,
       },
       user: {
           type: mongoose.Types.ObjectId,
           ref: 'User',
           required: true,
       },

},
{ timestamp: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

ProductSchema.virtual('reviews', { 
    ref: 'Review',
    localField: '_id',
    foreignField: 'Product',
    justOne: false,
});

module.exports = mongoose.model('Product', ProductSchema)