import OpenAI from "openai";
import { MessagesType } from "./state";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { TaskState } from "../tasks";
const client = new OpenAI({
  apiKey: process.env["NEXT_PUBLIC_OPENAI_API_KEY"],
  dangerouslyAllowBrowser: true,
});

export async function getChatResponse(messages: MessagesType) {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who helps the user create tasks. If there are tasks relevant to the user's request that it is appropriate to create, tell the user that you are creating a task or two and summarize the tasks are about. (When you do this this triggers a task creation event which will create the tasks and update the user's task list).",
      },
      ...messages,
    ],
    model: "gpt-4o-mini",
  });
  return chatCompletion.choices[0].message.content;
}

export async function extractTasks(text: string): Promise<{
  tasks: { title: string; description: string; state: TaskState }[];
}> {
  const maxRetries = 5; // Maximum number of retries
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const msg = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are provided with a message from a bot. You discern whether the bot intends to create task(s) for the user and output appropriately.",
          },
          { role: "system", content: text },
        ], // Cast to the correct type
        model: "gpt-4o-mini",
        response_format: zodResponseFormat(
          z.object({
            tasks: z
              .array(
                z.object({
                  title: z.string(),
                  description: z.string(),
                  state: z.nativeEnum(TaskState),
                })
              )
              .describe(
                "An array of tasks to create. Can be left blank if there are not tasks to create."
              ),
          }),
          "tasks"
        ),
      });
      if (!msg.choices[0].message.content) {
        throw new Error("No response from GPT");
      }
      return JSON.parse(msg.choices[0].message.content);
    } catch (error) {
      console.error(error);
      const typedError = error as { code: string };
      if (typedError.code === "rate_limit_exceeded") {
        attempt++;
        const waitTime = 200; // Wait for 200 ms
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error; // Rethrow if it's not a rate limit error
      }
    }
  }
  throw new Error("Max retries reached for GPT call");
}
