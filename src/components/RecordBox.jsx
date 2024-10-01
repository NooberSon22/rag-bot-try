import { FaMicrophone } from "react-icons/fa";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import speechToText from "../api/deepgram";
import responseLoaderStore from "../data/responseLoaderStore";

const RecordBox = ({ setMessages, sendMutateAsync }) => {
  const [isClicked, setIsClicked] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { setRecordingUserResponse } = responseLoaderStore((state) => state);
  const { mutate: transcribeAudio } = useMutation({
    mutationFn: (file) => speechToText(file),
    onSuccess: (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          content: data,
          isMachine: false,
        },
      ]);
      
      sendMutateAsync(data);
    },
    onError: (error) => {
      console.error("Transcription error:", error);
      alert("Failed to transcribe audio");
    },
  });

  const startRecording = () => {
    setRecordingUserResponse(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (e) => {
          audioChunksRef.current.push(e.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioFile = new File([audioBlob], "audio.wav", {
            type: "audio/wav",
          });
          transcribeAudio(audioFile);

          // Clear the recorded chunks after processing the audio file
          audioChunksRef.current = [];
          setRecordingUserResponse(false);
        });

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        alert("Microphone access denied or unavailable.");
      })
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSetIsClicked = () => {
    setIsClicked((prev) => {
      if (!prev) {
        startRecording(); // Start recording
      } else {
        stopRecording(); // Stop recording when the button is toggled off
      }

      return !prev;
    });
  };

  return (
    <button
      onClick={handleSetIsClicked}
      className={`text-white rounded-md p-2 ${
        isClicked ? "bg-red-500" : "bg-blue-500"
      }`}
    >
      <FaMicrophone />
    </button>
  );
};

export default RecordBox;
