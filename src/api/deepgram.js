//const DEEP_GRAM_URL = "https://api.deepgram.com/v1/listen";
const BASE_URL = "https://bot-backend-1-k7la.onrender.com";

const speechToText = async (file) => {
  console.log(file);
  try {
    const formData = new FormData();
    formData.append("audio", file);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value.name || value}`);
    }

    const response = await fetch(`${BASE_URL}/upload-audio`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to transcribe audio');
    }

    const { data } = await response.json();
    return data;

    // const response = await fetch(DEEP_GRAM_URL, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Token ${import.meta.env.VITE_DEEPGRAM_KEY}`,
    //     "Content-Type": "audio/wav",
    //   },
    //   body: formData,
    // });

    // if (!response.ok) {
    //   throw new Error("Failed to transcribe audio");
    // }

    // const data = await response.json();
    //return data;
  } catch (e) {
    console.log(e);
  }
};

export default speechToText;
