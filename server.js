import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import User from "./models/usersModel.js";
import connectDataBase from "./config/mongoDb.js";
import {notFound, errorHandler} from "./MiddleWare/Errors.js";
import Challenge from "./models/challengeSchema.js";
import Coin from "./models/coins.js"

const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());


app.get('/api/users', async (req, res) => {
  const userId = req.query.userId

  try {
    if(userId){
    const result = await User.find({ _id: userId });
    res.json(result)
    }
    const users = await User.find()
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/api/challenges', async (req, res) => {
  try {
    const { accepterId } = req.query;

    if (accepterId) {
//if with query fetch challs with query
      const challenges = await Challenge.find({ accepterId });
      res.json(challenges);
    } else {
      const challenges = await Challenge.find();
      res.json(challenges);
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


  app.post('/api/challenges/new/post', async (req, res) => {
    try {
      const { challengerName, gameName, consoleType, challengeAmount, challengerId, accepterId, avatar } = req.body;

      const newChallenge = await Challenge.create({
        challengerName,
        gameName,
        consoleType,
        challengeAmount,
        challengerId,
        accepterId,
        avatar
      });

      res.status(201).json(newChallenge); 
    } catch (error) {
      console.error('Error creating a challenge:', error);
      res.status(500).json({ message: 'An error occurred while creating a challenge' });
    }
  });


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
  
  app.use(notFound)
  app.use(errorHandler)

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDataBase("mongodbVSCodePlaygroundDB");
  });
