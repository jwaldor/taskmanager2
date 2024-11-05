import { create } from "zustand";
import { getChatResponse } from "./llm";
type SpeakerType = "user" | "assistant";
type MessageType = { role: SpeakerType; content: string };
export type MessagesType = MessageType[];

type ChatStore = {
  messages: MessagesType;
  addMessage: (message: MessageType) => void;
  // getResponse: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  // getResponse: async () => {
  //   const response = await getResponse(state.messages);
  //   set((state) => ({
  //     messages: [...state.messages, { role: "assistant", content: response as string }]
  //   }));
  // },
}));

export async function getResponse(messages: MessagesType) {
  const response = await getChatResponse(messages);
  useChatStore.getState().addMessage({
    role: "assistant",
    content: String(response),
  });
  return response;
}
