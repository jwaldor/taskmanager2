import OpenAI from "openai";
import { MessagesType } from "./state";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function getChatResponse(messages: MessagesType) {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who helps the user create tasks. First work with the user to understand what they want to create. Once they confirm what they want to create, include tasks in your output by outputing a JSON object which is an array of objects with the following fields: 'title', 'description', 'status' (pending, in progress, completed).",
      },
      ...messages,
    ],
    model: "gpt-4o-mini",
  });
  return chatCompletion.choices[0].message.content;
}
