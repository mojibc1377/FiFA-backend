import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  
    challengerName:String,
    gameName:String,
    consoleType : String,
    challengeAmount : Number,
    challengerId:String,
    accepterId:String,
    avatar:String,
    createdAt: { type: Date, default: Date.now }
    
  });

const Challenge = mongoose.model("Challenge", challengeSchema)
export default Challenge;