import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import User from "./models/usersModel.js";
import connectDataBase from "./config/mongoDb.js";
import {notFound, errorHandler} from "./MiddleWare/Errors.js";
import Challenge from "./models/challengeSchema.js";
import Coin from "./models/coins.js"
import bodyParser from "body-parser";
import moment from 'moment';
import Comment from "./models/comments.js";


const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())


app.get('/api/users', async (req, res) => {
  const userId = req.query.userId

  try {
    if(userId){
    const result = await User.find({ _id: userId });
    return res.json(result);
    }
    const users = await User.find()
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post("/api/users/purchase-coins", async (req, res) => {
  const { userId, amount } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate the new account credit after the purchase
    const newAccountCredit = parseFloat(user.accountCredit) - parseFloat(Math.ceil(amount*0.8));

    // Update the user's accountCredit in the database
    user.accountCredit = newAccountCredit
    await user.save();

    return res.json({ message: "Coins purchased successfully!", accountCredit: newAccountCredit.toFixed(2) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
});
app.post("/api/users/sell-coins", async (req, res) => {
  const { userId, amount } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate the new account credit after the purchase
    const newAccountCredit = parseFloat(user.accountCredit) + parseFloat(Math.ceil(amount*0.6));

    // Update the user's accountCredit in the database
    user.accountCredit = newAccountCredit;
    await user.save();

    return res.json({ message: "Coins purchased successfully!", accountCredit: newAccountCredit.toFixed(2) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
});

app.get('/api/challenges', async (req, res) => {
  try {
    const { accepterId } = req.query;
    const { challengerId } = req.query;


    if (accepterId) {
//if with query fetch challs with query
      const challenges = await Challenge.find({ accepterId });
      res.json(challenges);
    } else {
      if(challengerId){
        const challenges = await Challenge.find({ challengerId });
        res.json(challenges)

      }else{
        const challenges = await Challenge.find();
        res.json(challenges);
      }
     
    }
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

  app.put('/api/settings/users/:userId', async (req, res) => {
  const userId = req.params.userId; 
  const dataToUpdate = req.body; 

  try {
    
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Route to charge user's wallet
app.post("/api/users/charge-wallet", async (req, res) => {
  const { userId, amount } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the user's accountCredit
    user.accountCredit = String(
      parseFloat(user.accountCredit) + parseFloat(amount)
    );

    await user.save();

    return res.json({ message: "Wallet charged successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
});

app.get("/api/challenge/:id",async(req,res) =>{
  try {
    const id = req.params.id;
    const result = await Challenge.findById(id)
    res.json(result)
    
  } catch (error) {
    console.error('Error fetching challenge:', error);
      res.status(500).json({ message: 'Server Error' });
  }
})
  app.put('/api/challenges/:id', async (req, res) => {
    try {
      const challengeId = req.params.id;
      const updatedChallenge = req.body;

      // Find the challenge by ID and update it 
      const result = await Challenge.findByIdAndUpdate(challengeId, updatedChallenge);

      res.json(result);
    } catch (error) {
      console.error('Error updating challenge:', error);
      res.status(500).json({ message: 'Server Error' });
    }
})

app.delete('/api/challenges/delete-old', async (req, res) => {
  try {
    // Calculate the timestamp 48 hours ago from now
    const timestamp48HoursAgo = moment().subtract(48, 'hours').toDate();

    // Delete challenges older than the timestamp
    await Challenge.deleteMany({ createdAt: { $lt: timestamp48HoursAgo } });

    res.status(200).json({ message: 'Old challenges deleted successfully.' });
  } catch (error) {
    console.error('Error deleting old challenges:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

  app.post('/api/challenges/new/post', async (req, res) => {
    try {
      const { challengerName, gameName, consoleType, challengeAmount, challengerId, accepterId, avatar,createdAt } = req.body;

      const newChallenge = await Challenge.create({
        challengerName,
        gameName,
        consoleType,
        challengeAmount,
        challengerId,
        accepterId,
        avatar,
        createdAt
      });

      res.status(201).json(newChallenge); 
    } catch (error) {
      console.error('Error creating a challenge:', error);
      res.status(500).json({ message: 'An error occurred while creating a challenge' });
    }
  });

  app.get("/api/challenges/comments/:challengeId" , async(req,res) =>{
    try {
      const challengeId = req.params.challengeId
      const result = await Comment.find({challengeId:challengeId}) // find comments based on challenge ID
      res.status(201).json(result)

    } catch (error) {
      console.error('Error fetching comment:', error);
      res.status(500).json({ message: 'An error occurred while fetching comments' });
    }
  })
app.post("/api/challenges/comments/new" , async(req,res) => {
  try {
    const {commenterId, challengeId, receiverId, comment, createdAt} = req.body
    const newComment = await Comment.create({
      commenterId,
      challengeId,
      receiverId,
      comment,
      createdAt
    })
    res.status(201).json(newComment); 
  } catch (error) {
    console.error('Error sending the comment :', error);
      res.status(500).json({ message: 'An error occurred while sending a comment' });
  }
 

    // commenterId: {
    //   type: String,
    //   required: true,
    // },
    // challengeId :{
    //   type:String,
    //   required : true,
    // },
    // receiverId: {
    //   type: String,
    //   required: true,
    // },
    // comment: {
    //   type: String,
    //   required: true,
    // },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },schema 


})

  app.post('/api/signup', async (req, res) => {
    const { name, username, password, phoneNumber, psnId, avatar } = req.body;

    try {

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken. Please choose a different one.' });
      }

      const newUser = new User({
        name,
        username,
        password,
        number: phoneNumber,
        psnId,
        accountCredit: '0', //default value
        avatar
      });

      const savedUser = await newUser.save();

      res.status(201).json(savedUser);
    } catch (error) {
      console.error('Error creating a new user:', error);
      res.status(500).json({ message: 'An error occurred while creating a new user' });
    }
  });

    app.post('/api/coins', async (req, res) => {
    try {
      const { mizan, psnId , requestType } = req.body;
  
      // Create a new coin document using the Coin model
      const newCoin = new Coin({
        mizan: mizan,
        psnId: psnId,
        requestType
      });
      await newCoin.save();
  
      res.status(201).json({ message: 'Coin added successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/api/comments', async (req, res) => {
    try {
      const { commenterId, receiverId, comment } = req.body;
  
      // Check if both commenterId and receiverId are provided
      if (!commenterId || !receiverId) {
        return res.status(400).json({ message: 'Both commenterId and receiverId are required' });
      }
  
      // Create the new comment
      const newComment = await Comment.create({ commenterId, receiverId, comment });
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'An error occurred while creating the comment' });
    }
  });
  
  // API endpoint to fetch comments
  app.get('/api/comments', async (req, res) => {
    try {
      const { commenterId, receiverId } = req.query;
      let comments;
  
      // If both commenterId and receiverId are provided, fetch comments for that specific pair
      if (commenterId && receiverId) {
        comments = await Comment.find({ commenterId, receiverId });
      } else if (commenterId) {
        // If only commenterId is provided, fetch comments for the specific commenter
        comments = await Comment.find({ commenterId });
      } else if (receiverId) {
        // If only receiverId is provided, fetch comments for the specific receiver
        comments = await Comment.find({ receiverId });
      } else {
        // Fetch all comments
        comments = await Comment.find();
      }
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'An error occurred while fetching comments' });
    }
  });
  
  
  app.use(notFound)
  app.use(errorHandler)

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDataBase("mongodbVSCodePlaygroundDB");
  });
