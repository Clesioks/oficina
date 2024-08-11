import path from 'path'
import express from 'express'
import connectDB from './dbConnect.js'
import dotenv from 'dotenv'
dotenv.config()
import userRoute from './routes/usersRoutes.js'
import transactionsRoute from './routes/transactionsRoute.js'


const port = process.env.PORT || 21075

connectDB()


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/api/users/', userRoute)
app.use('/api/transactions/', transactionsRoute)

const __dirname = path.resolve()


if (process.env.NODE_ENV === 'production') {
       // set statec folder
       app.use(express.static(path.join(__dirname, '/client/build')))

       // any route
       app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))  
       })
} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
    
})