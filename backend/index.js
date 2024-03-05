const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));

const PORT = process.env.PORT || 8088
app.listen(PORT);

//Get the translated content from Chat GPT API
app.post('/api/translate', async(req, res, next) => {
  if(req.body.language == undefined || req.body.word == undefined || req.body.language === '' || req.body.word === '') {
    res.send("Please fill all the fields");
  }
  const prompt = `Translate this into ${req.body.language}:\n\ ${req.body.word} \n\n`
  try {
    const answer = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
     messages: [
      {
        role: "user",
        content: prompt
      }
     ]
    });
    res.send(answer.data.choices[0].message.content);
  }
  catch(error) {
    return next(error);
  }
});
module.exports = router;
