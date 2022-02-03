require('dotenv').config();
const express = require('express')
const app = express()
const connectDB = require('./db/connect');
//const morgan = require('morgan')
const notFound = require('./middleware/not-found');
const ProductRoute = require('./routes/product')





app.use(express.static('./public'));

// packages
const fileUpload = require('express-fileupload');





//middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//app.use(morgan('dev'));




// Routes
app.use('/api/products',  ProductRoute)





app.use(fileUpload)
app.use(notFound)
app.use(express.json());
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




const port = process.env.PORT || 6000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        
app.listen(port, ()=>{
    console.log(`port is listing on ${port}`)
})
    } catch (error) {
       console.log(error) 
    }
};
//start();