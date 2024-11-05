import { create } from "zustand";

type SpeakerType = "user" | "assistant";
type MessageType = { role: SpeakerType; content: string };
type MessagesType = MessageType[];

type ChatStore = {
  messages: MessagesType;
  addMessage: (message: MessageType) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
