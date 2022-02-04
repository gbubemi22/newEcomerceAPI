const express = require('express')
const router = express.Router();
const Product = require('../models/Product');
const{StatusCodes} = require('http-status-codes');
const {CustomError } = require('../errors/index');
const path = require('path');



const productImage = [];



router.post('/', productImage, async (req, res) => {
    try {
        req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product })  
    } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
           error: 'Something went wrong'
       }) 
    }
  
})

router.get('/', async (req, res) => {
    const products = await Product.find({});


    res.status(StatusCodes.OK).json({products, count: products.length});
})


router.get('/:id', async (req, res) =>{
    const { id: productId} =  req.params;

    const product = await Product.findOne({ _id: productId}).populate('reviews')
    
    
    if(!product) {
         throw new CustomError.NotFoundError(`No product with id : ${productId}`)
    }

    res.status(StatusCodes.OK).json({ product})
})


router.patch('/:id', async (req, res) => {
    const {id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId ,
      new: true,
      runValidators: true,  
        });

        if(!product) {
            throw new CustomError.NotFoundError(`No product with id : ${productId}`)
        }

        res.status(StatusCodes.OK).json({ product });

})

router.delete('/:id', async (req, res) => {
    const {id: productId } = req.params;

    const product  = await Product.findOne({_id:  productId });


    if(!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`)

    }
    await product.remove();
    res.status(StatusCodes.OK).json({msg: 'Success! Product removed.'})

})






router.post('/uploadImage', async (req,res) => {
   
    if (!req.files) {
        throw new CustomError.BadRequestError('No File Uploaded')
    }  
   
     const productImage = req.files.image;
   
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please Upload image')
    }
    const maxSize = 1024 * 1024 
   
    if(productImage.size > maxSize) {
        throw new CustomError.BadRequestError(
            'Please upload image smaller than 1MB'
        );
    }
   
    const imagePath = path.join(
        __dirname,
        '../public/uploads' + `${productImage.name}`
    );
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK),json({image: `/uploads/${productImage.name}`})
         
    //const  fileUpload = productImage; 
   
   })








module.exports = router;

