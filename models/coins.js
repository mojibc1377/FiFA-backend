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

const Coin = mongoose.model('Coin', coinSchema);

export default Coin;