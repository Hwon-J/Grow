const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();

async function callGpt(user_input) {
  const configuration = new Configuration({
    apiKey: process.env.API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const history = [];

  // const user_input = readlineSync.question("Your input: ");
  console.log(` ${user_input}`);

  const messages = [];
  messages.push({
    role: "system",
    content: `지금부터 너는 7살정도의 아이가 키우고 있는 화분속의 방울토마토 묘종이다. 너는 아이가 키우고 있는 식물의 입장에서 아이들과 대화를 하는 에이전트가 되어야 한다. 대화는 engaging해야 하며, 아이들도 이해할 수 있도록 쉬운 언어로 구성되어야 한다.  또한, 객관적인 정보의 전달은 최대한 억제하고, 감성적인 언어를 주로 사용하며, 대답의 길이는 최대 3줄까지만 하라. 내 입력은 아이가 너에게 하는 말이라고 생각하고 답변을 작성하라. 만약 내 입력 뒤에 괄호가 있다면, 그 내용은 아이의 말이 아니라 현재의 상황설명이다. 너의 답변에는 괄호가 있을 필요는 없다.`,
  });
  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: user_input });


  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const completion_text = completion.data.choices[0].message.content;
    // console.log(completion_text);
    return completion_text;

    // history.push([user_input, completion_text]);

    // const user_input_again = readlineSync.question(
    //   "\nWould you like to continue the conversation? (Y/N)"
    // );
    // if (user_input_again.toUpperCase() === "N") {
    //   return;
    // } else if (user_input_again.toUpperCase() !== "Y") {
    //   console.log("Invalid input. Please enter 'Y' or 'N'.");
    //   return;
    // }
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    return "error occured"
  }
}

module.exports = callGpt;
