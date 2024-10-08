// /hooks/usePortScanner.ts
import { PortInfo } from "@/components/component/PortsTable";
import { useEffect, useState } from "react";

export const usePortScanner = (
  host: string,
  startPort: number,
  endPort: number
) => {
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    const scanPorts = async () => {
      setIsScanning(true);
      try {
        const response = await fetch("/api/ports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ host, startPort, endPort }),
        });

        if (!response.ok) throw new Error("Failed to scan ports");
        const data = await response.json();

        // Map the results to the PortInfo format
        const formattedPorts: PortInfo[] = data.map(
          (result: { port: number; isOpen: boolean }) => ({
            port: result.port,
            protocol: "TCP", // Assuming TCP, you can modify based on your requirements
            isOpen: result.isOpen,
            service: result.isOpen ? "Service" : "Closed", // Add logic to determine service if needed
          })
        );

        setPorts(formattedPorts);
      } catch (error) {
        console.error(error);
      } finally {
        setIsScanning(false);
      }
    };

    scanPorts();
  }, [host, startPort, endPort]);

  return { ports, isScanning };
};
