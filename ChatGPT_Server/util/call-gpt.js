const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

async function callGpt(user_input) {
  const configuration = new Configuration({
    apiKey: process.env.API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: user_input,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const completion_text = completion.data.choices[0].message.content;
    
    return completion_text;
  } catch (error) {
    if (error.response) {
      winston.error(error.response.status);
      winston.error(error.response.data);
    } else {
      winston.error(error.message);
    }
    return "error occured"
  }
}

module.exports = callGpt;
