import { create } from "zustand";
import { getChatResponse, getChatResponseCustom } from "./llm";
import { extractTasks, suggestTasks } from "./llm";
import useTaskStore, { Task } from "../tasks";
type SpeakerType = "user" | "assistant";
type MessageType = { role: SpeakerType; content: string };
export type MessagesType = MessageType[];

type ChatStore = {
  messages: MessagesType;
  addMessage: (message: MessageType) => void;
  setMessages: (messages: MessagesType) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  proposedTasks: Task[];
  setProposedTasks: (tasks: Task[]) => void;
  // getResponse: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      role: "assistant",
      content: `Greetings. I am an AI assistant that helps you achieve your goals. I can 
    1. discuss how you can achieve your goals
    2. generate concrete tasks
    3. workshop tasks to make them more effective and actionable`,
    },
  ],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: MessagesType) =>
    set({ messages: structuredClone(messages) }),
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),
  proposedTasks: [],
  setProposedTasks: (tasks) => set({ proposedTasks: tasks }),
  // getResponse: async () => {
  //   const response = await getResponse(state.messages);
  //   set((state) => ({
  //     messages: [...state.messages, { role: "assistant", content: response as string }]
  //   }));
  // },
}));

// export async function getResponse(message: string) {
//   useChatStore.getState().addMessage({ role: "user", content: message });
//   const allMessages = useChatStore.getState().messages;
//   console.log("allMessages", allMessages);
//   const response = await getChatResponse(allMessages);
//   console.log("response", response);

//   const tasks = response ? await extractTasks(response) : undefined;
//   console.log("tasks", tasks);

//   useChatStore.getState().addMessage({
//     role: "assistant",
//     content:
//       String(response) +
//       (tasks && tasks.tasks.length > 0
//         ? "\n" +
//           "Creating tasks: " +
//           tasks.tasks.map((task) => task.title).join(", ")
//         : ""),
//   });

//   if (tasks) {
//     console.log("creating provided tasks", tasks.tasks);
//     useTaskStore.getState().createProvidedTasks(tasks.tasks);
//   }
//   return response;
// }

const BASIC_SYSTEM_PROMPT =
  "You are a helpful assistant who helps the user strategize what to do in a compassionate, empathetic, and creative way. You help the user think of things that they would not have without you. Respond in <4 sentences/<4 bullet points.";

export async function handleSendMessage() {
  const inputValue = useChatStore.getState().inputValue;
  const messages = structuredClone(useChatStore.getState().messages);
  messages.push({
    role: "user",
    content: inputValue,
  });
  useChatStore.getState().setInputValue(""); // Clear input after sending
  const response = await getChatResponseCustom(messages, BASIC_SYSTEM_PROMPT);
  messages.push({
    role: "assistant",
    content: response ?? "",
  });
  useChatStore.getState().setMessages(messages);
  return response;
}

export async function createProposedTasks() {
  const { createProvidedTasks } = useTaskStore.getState();
  const { proposedTasks } = useChatStore.getState();
  createProvidedTasks(proposedTasks);
  useChatStore.getState().setProposedTasks([]);
}

export async function rejectProposedTasks() {
  useChatStore.getState().setProposedTasks([]);
}

export async function handleSuggestTasks() {
  const inputValue = useChatStore.getState().inputValue;
  useChatStore.getState().setInputValue(""); // Clear input after sending
  const allMessages = useChatStore.getState().messages;
  useChatStore.getState().addMessage({
    role: "user",
    content: "[Requesting task suggestions]: " + inputValue,
  });
  const response = await suggestTasks(
    allMessages.concat([{ role: "user", content: inputValue }])
  );
  console.log("response", response);
  useChatStore.getState().addMessage({
    role: "assistant",
    content:
      "[Task suggester]: " +
      response.tasks.map((task) => JSON.stringify(task)).join(", "),
  });
  useChatStore.getState().setProposedTasks(response.tasks);
}
