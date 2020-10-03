const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());


app.listen(process.env.PORT, () => {
    console.log(`Server started at PORT ${process.env.PORT}`);
})

// Api test
app.get('/', (req, res) => {
    res.send('Api is working perfectly!');
})