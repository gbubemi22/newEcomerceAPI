const express = require('express')
const app = express()




app.get('/', (req, res) =>{
    res.send('i dey work o')
})




const name = ['zoom', 'loom']

console.log(name);
const port = 6000;


app.listen(port, ()=>{
    console.log(`port is listing on ${port}`)
})