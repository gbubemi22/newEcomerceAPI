const express = require('express');
router = express.Router();


Order = require('../models/Order');
Product = require('../models/Order')

const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')


const fakeStripeAPI = async ({ amount, currency }){

}

router.post('/', (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if(!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('NO cart items is provided');

    }

    if(!tax || !shippingFee) {
        throw new CustomError.BadRequestError(
            'Please provide tax and shipping'
        )
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product })
        if(!dbProduct) {
            throw new CustomError.BadRequestError(
                `No product with id : ${item.product}`
            );
        }
        const {name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            product: _id,
        };
        // add item to orderItems
        orderItems = [...orderItems, singleOrderItem];
        //calculate subtotal
        subtotal += item.amount * price;
    }
    //calculate total 
    const total = tax + shippingFee + subtotal
    //get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });

    const order = await Order.create({
       orderItems,
       total,
       subtotal,
       tax,
       shippingFee,
       clientSecret: paymentIntent.client_secret,
       user: req.user.userId,
    });

    res.status(StatusCodes.OK).json({
        order, clientSecret: order.clientSecret
    })
}) 




router.get('/', async (req, res) =>{
    try {
        const orders = await Order.find({});
        res.status(StatusCodes.OK).json({ orders, count: orders.length })   
    } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
           error: 'Something went wrong'
       }) 
    }
   
})


router.get('/:id', async (req, res) => {
    try {
        const { id: orderId } =  req.params;
        const order = await Order.findOne({ _id: orderId})
        if(!order) {
            throw new CustomError.NotFoundError(`No order with id ${orderId}`)

        }
         // from utils 
        checkPermission(req.user, order.user);
        res.status(StatusCodes.OK).json({ order });
    } catch (error) {
        
    }
    
})


router.get('/showAllMyOrders', async (req, res) =>{
    const orders = await Order.find({ user: req.user.userId}) 
})