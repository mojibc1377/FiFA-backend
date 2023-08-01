import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  
    challengerName:String,
    gameName:String,
    consoleType : String,
    challengeAmount : Number,
    challengerId:String,
    accepterId:String,
    resultPhoto: {
      type: String,
      default: '' // You can set a default value if needed
    },
    avatar:String,
    createdAt: { type: Date, default: Date.now }
    
  });

const Challenge = mongoose.model("Challenge", challengeSchema)
export default Challenge;