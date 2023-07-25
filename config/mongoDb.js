import mongoose from 'mongoose'

const connectDataBase = async(dbname) => {
    try {
        const connection = await mongoose.connect(process.env.DB_URI , {
            useUnifiedTopology : true,
            useNewUrlParser : true,
            dbName: dbname,
        }
        )
        console.log("mongo connected ")
    } catch (error) {
        console.log( `Error : ${error}`)
        process.exit(1)
    }
}
export default connectDataBase;