import mongoose from "mongoose"

const coinSchema = new mongoose.Schema({
  mizan: {
    type: Number,
    required: true,
  },
  psnId: {
    type: String,
    required: true,
  },
  requestType : {
    type : String,
    required : true
  }
});

// Create the coin model from the schema
const Coin = mongoose.model('Coin', coinSchema);

export default Coin;