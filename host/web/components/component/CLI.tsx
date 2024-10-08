"use client";
import React, { useState } from "react";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";
import ConnectionHeader from "@/components/component/ConnectionHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CLIProps {
  IP: string;
  isOnline: boolean;
  terminalLines: JSX.Element[]; // Accept terminal lines as prop
  updateTerminalLines: (lines: JSX.Element[]) => void; // Accept update function as prop
}

const CLI = ({ IP, isOnline, terminalLines, updateTerminalLines }: CLIProps) => {
  const [colorMode] = useState(ColorMode.Dark);

  const sendCmd = async (cmd: string) => {
    try {
      const res = await fetch("/api/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: cmd }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      
      const data = await res.json();
      return data.message;
    } catch (error) {
      console.error("Error sending command:", error);
      return `Error: ${error}`;
    }
  };

  const onInput = async (input: string) => {
    const newLines = [
      ...terminalLines,
      <TerminalInput key={terminalLines.length}>{input}</TerminalInput>
    ];

    if (input.toLowerCase().trim() === "clear") {
      updateTerminalLines([<TerminalOutput key={0}>Terminal cleared.</TerminalOutput>]);
    } else if (input) {
      const output = await sendCmd(input);
      newLines.push(<TerminalOutput key={newLines.length}>{output}</TerminalOutput>);
      updateTerminalLines(newLines); // Update terminal lines in parent
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <ConnectionHeader IP={IP} isOnline={isOnline} />
      </CardHeader>
      <CardContent>
        <Terminal name={`CLI For ${IP}`} colorMode={colorMode} onInput={onInput}>
          {terminalLines}
        </Terminal>
      </CardContent>
    </Card>
  );
};

export default CLI;
