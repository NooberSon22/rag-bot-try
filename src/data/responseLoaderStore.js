import { create } from "zustand";

const responseLoaderStore = create((set) => ({
  loadingBotResponse: false,
  recordingUserResponse: false,

  setLoadingBotResponse: (value) => {
    set(() => ({ loadingBotResponse: value }));
  },
  setRecordingUserResponse: (value) => {
    set(() => ({ recordingUserResponse: value }));
  },
  reset: () => {
    set(() => ({ loadingBotResponse: false, recordingUserResponse: false }));
  },
}));

export default responseLoaderStore;
