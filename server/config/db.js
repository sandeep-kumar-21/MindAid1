import mongoose from 'mongoose';

const ConnectDB = async () => {
  try {
    mongoose.connection.on('connected', ()=> console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGO_URI}/MindAid`);
  } catch (error) {
    console.log(error.message);
  }
};

export default ConnectDB
