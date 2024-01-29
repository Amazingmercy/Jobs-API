require('dotenv').config()
require('express-async-errors')


const connectDB = require('./Db/connectDb')
const DB_URI = process.env.MONGO_DB_URI
const authenticate = require('./middlewares/authenticate')


const express = require('express')
const app = express()


//Extra security modules
const helmet = require('helmet')
const cors = require('cors')
const {rateLimit } = require('express-rate-limit')
const xss = require('xss-clean')//Validate all user inputs

//Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocs = YAML.load('./swagger.yaml')


//Error handler
const notFoundMiddleware = require('./middlewares/notFound')
const errorHandlerMiddleware = require('./middlewares/errorHandler')

app.get('/', (req, res) => {
    res.send('<h1>JOBS API</h1><a href="/api-docs">API Documentation </a>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

//Routes
const authRoutes = require('./routes/authRoutes')
const JobRoutes = require('./routes/jobsRoutes')

app.set('trust proxy', 1)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

app.use(limiter)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())


//Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', authenticate, JobRoutes)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)



const port = process.env.PORT || 9000
const start = async () => {
    try{
        await connectDB(DB_URI)
        app.listen(port, console.log(`App is listening on port ${port}`));
    } catch (error){
        console.log(error);
    }
    
}

start()