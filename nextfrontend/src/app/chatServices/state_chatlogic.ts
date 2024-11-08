import { getChatResponseCustom, suggestTasks } from "./llm";
import { useChatStore } from "./state";
import { chooseMode } from "./llm";

export async function handleSendMessage2() {
  const inputValue = useChatStore.getState().inputValue;
  const messages = structuredClone(useChatStore.getState().messages);
  messages.push({
    role: "user",
    content: inputValue,
  });
  useChatStore.getState().setInputValue(""); // Clear input after sending
  const response = await chooseMode(messages.slice(-4));
  console.log(response.mode, "mode");
  if (response.mode === "discuss" || response.mode === "generate") {
    useChatStore.getState().setProposedTasks([]);
  }
  if (response.mode === "discuss") {
    const response2 = await getChatResponseCustom(
      messages,
      `You are an AI assistant that helps the user achieve their goals. You are able to: 
      1. discuss how you can achieve your goals; 
      2. suggest concrete tasks; 
      3. workshop suggested tasks to make them more effective and actionable
      You are currently in *discuss* mode.
      Make your responses creative and concise.`
    );
    messages.push({
      role: "assistant",
      content: response2 ?? "",
    });
  } else if (response.mode === "workshop") {
    // const taskThoughts = await getChatResponseCustom(
    //   messages.slice(-8),
    //   `You are an AI assistant that helps the user achieve their goals. You are able to:
    //   1. discuss how you can achieve your goals;
    //   2. suggest concrete tasks;
    //   3. workshop suggested tasks to make them more effective and actionable
    //   You are currently in *workshop* mode.
    //   Based on the conversation, empathize with the user to generate three sentences of thoughts on how to improve the suggested tasks.`
    // );
    // messages.push({
    //   role: "assistant",
    //   content: "[Thoughts]: " + String(taskThoughts),
    // });
    // const newTasks = await suggestTasks(messages);
    // messages.push({
    //   role: "assistant",
    //   content: "[Task suggester]: " + JSON.stringify(newTasks),
    // });
    const response2 = await getChatResponseCustom(
      messages,
      `You are an AI assistant that helps the user achieve their goals. You are able to: 
      1. discuss how you can achieve your goals; 
      2. suggest concrete tasks; 
      3. workshop suggested tasks to make them more effective and actionable
      You are currently in *workshop* mode.
      Make your responses creative and concise.`
    );
    messages.push({
      role: "assistant",
      content: response2 ?? "",
    });
    // useChatStore.getState().setProposedTasks(newTasks.tasks);
  } else if (response.mode === "generate") {
    const taskThoughts = await getChatResponseCustom(
      messages.slice(-8),
      `You are an AI assistant that helps the user achieve their goals. You are able to: 
      1. discuss how you can achieve your goals; 
      2. suggest concrete tasks; 
      3. workshop suggested tasks to make them more effective and actionable
      You are currently in *workshop* mode.
      Based on the conversation, empathize with the user to generate thoughts on how to improve the suggested tasks.`
    );
    messages.push({
      role: "assistant",
      content: "[Thoughts]: " + String(taskThoughts),
    });
    const newTasks = await suggestTasks(messages);
    messages.push({
      role: "assistant",
      content: "[Task suggester]: " + JSON.stringify(newTasks),
    });
    const response2 = await getChatResponseCustom(
      messages,
      `You are an AI assistant that helps the user achieve their goals. You are able to: 
      1. discuss how you can achieve your goals; 
      2. suggest concrete tasks; 
      3. workshop suggested tasks to make them more effective and actionable
      You are currently in *workshop* mode.
      Make your responses creative and concise.`
    );
    messages.push({
      role: "assistant",
      content: response2 ?? "",
    });
    useChatStore.getState().setProposedTasks(newTasks.tasks);
    console.log(newTasks.tasks);
  }

  useChatStore.getState().setMessages(messages);
  return response;
}
