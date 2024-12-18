require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorMiddleware = require('./middlewares/error-middleware');
const router = require('./router/index')
const path = require('path');
const team = require('./router/team')
const help = require('./router/help-request-routes')
const chat = require('./router/chat-routes')
const sponsor = require('./router/sponsor-routes')

const PORT = process.env.PORT || 3005
const app = express()
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router)
app.use('/team', team)
app.use('/help', help)
app.use('/chat', chat)
app.use('/sponsor', sponsor)

const start = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, {
       
        })
        app.listen(PORT, () => console.log('listening on port 3005'))
    } catch (e) {
        console.log(e)
    }
}

start()