import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://kornalewski:silva123@cluster0.ppn65ee.mongodb.net/sheymoney')
        console.log(`MongoDB conectado ${conn.connection.host}`);        
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1)        
    }
}

export default connectDB