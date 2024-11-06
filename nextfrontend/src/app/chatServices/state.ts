import { create } from "zustand";
import { getChatResponse } from "./llm";
import { extractTasks } from "./llm";
import useTaskStore, { Task } from "../tasks";
type SpeakerType = "user" | "assistant";
type MessageType = { role: SpeakerType; content: string };
export type MessagesType = MessageType[];

type ChatStore = {
  messages: MessagesType;
  addMessage: (message: MessageType) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  proposedTasks: Task[];
  setProposedTasks: (tasks: Task[]) => void;
  // getResponse: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
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

export async function getResponse(message: string) {
  useChatStore.getState().addMessage({ role: "user", content: message });
  const allMessages = useChatStore.getState().messages;
  console.log("allMessages", allMessages);
  const response = await getChatResponse(allMessages);
  console.log("response", response);

  const tasks = response ? await extractTasks(response) : undefined;
  console.log("tasks", tasks);

  useChatStore.getState().addMessage({
    role: "assistant",
    content:
      String(response) +
      (tasks && tasks.tasks.length > 0
        ? "\n" +
          "Creating tasks: " +
          tasks.tasks.map((task) => task.title).join(", ")
        : ""),
  });

  if (tasks) {
    console.log("creating provided tasks", tasks.tasks);
    useTaskStore.getState().createProvidedTasks(tasks.tasks);
  }
  return response;
}
