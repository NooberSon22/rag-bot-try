import { create } from "zustand";

const chatStore = create((set) => ({
  currentConversation: null, // Use null for unselected state
  previousConversation: null, // Use null for unselected state

  // Action to choose a conversation
  chooseConversation: (conversation) => {
    set((state) => ({
      currentConversation: conversation,
      previousConversation: state.currentConversation || null, // Optional chaining
    }));
  },

  // Action to clear the current conversation
  clearCurrentConversation: () =>
    set(() => ({ currentConversation: null, previousConversation: null })),
}));

export default chatStore;
