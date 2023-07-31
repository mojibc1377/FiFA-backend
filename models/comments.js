import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
  commenterId: {
    type: String,
    required: true,
  },
  challengeId :{
    type:String,
    required : true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});




const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
