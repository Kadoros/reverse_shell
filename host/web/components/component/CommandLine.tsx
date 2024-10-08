"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import ConnectionHeader from "./ConnectionHeader";

interface CommandHistoryEntry {
  dir: string; // Directory for the command
  cmd: string; // The command itself
  res: string;
}

export default function Home() {
  const [commands, setCommands] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]); // Track command responses
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([
    { dir: "C:\\>", cmd: "dir", res: "smth" },
  ]); // Track command history as objects
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentCmdDir, setCurrentCmdDir] = useState<string>("C:\\>");
  const [writingCmd, setWritingCmd] = useState<string>("ip");

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedCommand = currentCommand.trim();
      let data = null as any;

      if (trimmedCommand) {
        // Add command to history with current directory
        

        // Send command to the backend
        try {
          const res = await fetch("/api/input", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: trimmedCommand }),
          });

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          data = await res.json();
          setResponses((prev) => [...prev, data.message]); // Store response message
          setResponseMessage(data.message);
          console.log(data);
        } catch (error) {
          console.error("Error sending command:", error);
        }

        setCommandHistory((prev) => [
          ...prev,
          { dir: currentCmdDir, cmd: trimmedCommand, res: data},
        ]);
        setHistoryIndex(null);

        setCurrentCommand(""); // Clear the textarea
      }
    } else if (event.key === "Escape") {
      setCurrentCommand("");
      setHistoryIndex(null);
    } else if (event.key === "ArrowUp") {
      if (historyIndex === null) {
        setHistoryIndex(commandHistory.length - 1);
      } else if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
      }
    } else if (event.key === "ArrowDown") {
      if (historyIndex !== null && historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1);
      } else {
        setHistoryIndex(null);
      }
    }

    if (historyIndex !== null) {
      const commandToDisplay = commandHistory[historyIndex]?.cmd || "";
      setCurrentCommand(commandToDisplay);
    }
  };

  // Combine command and response into the textarea value
  
  const getCmdValue = () => {
    const commandHistoryLines = commandHistory.map(
      (entry) => `${entry.dir} ${entry.cmd}\n${entry.res}`
    ).join("\n");

    const currentCmdLine = `${currentCmdDir} ${writingCmd}`;
    return `${commandHistoryLines}\n${currentCmdLine}`;
  };

  const textareaOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWritingCmd(e.target.value.split(" ").slice(1).join(" "))
  }


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <ConnectionHeader IP="192.0.0.1" isOnline={false} />
      <Card className="bg-black text-white p-4 rounded-lg shadow-md w-full h-full font-mono overflow-auto flex flex-col">
        <textarea
          ref={inputRef}
          value={getCmdValue()} // Combine history and current command
          onChange={(e) => textareaOnChange(e)}
          onKeyDown={handleKeyDown}
          className="ml-2 bg-transparent focus:outline-none text-white flex-1 overflow-auto w-full h-full"
          rows={3}
          readOnly={false}
        />
        <input
          type="text"
          value={writingCmd}
          onChange={(e) => setWritingCmd(e.target.value)}
          className="mt-2 bg-transparent border-b-2 border-white focus:outline-none text-white"
          placeholder="Type command here..."
        />
      </Card>
    </div>
  );
}
