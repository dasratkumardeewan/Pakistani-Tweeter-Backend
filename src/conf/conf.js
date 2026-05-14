import dotenv from 'dotenv'
dotenv.config()


if(!process.env.PORT){
    console.log("PORT is not defined in .env file");
    process.exit(1);
}
if(!process.env.MONGODB_URI){
    console.log("MONGODB_URI is not defined in .env file");
    process.exit(1);
}

const config = {
    PORT:process.env.PORT || 5000,
    MONGODB_URI:process.env.MONGODB_URI
}

export default config