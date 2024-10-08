// /app/api/ports/route.ts
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const scanPortsUsingNmap = async (host: string, startPort: number, endPort: number) => {
  const command = `nmap -p ${startPort}-${endPort} ${host} -oG -`; // Use -oG for grepable output

  try {
    const { stdout } = await execAsync(command);
    const results: { port: number; isOpen: boolean }[] = [];

    // Process the output to get open ports
    const lines = stdout.split("\n");
    for (const line of lines) {
      const match = line.match(/(\d+)\/(open|closed)/);
      if (match) {
        const port = parseInt(match[1]);
        const isOpen = match[2] === "open";
        results.push({ port, isOpen });
      }
    }

    return results;
  } catch (error) {
    console.error("Error executing nmap:", error);
    throw new Error("Failed to scan ports");
  }
};

export async function POST(request: Request) {
  console.log("post start");

  const { host, startPort, endPort } = await request.json();

  const results = await scanPortsUsingNmap(host, startPort, endPort);

  console.log("post end");
  return NextResponse.json(results);
}
