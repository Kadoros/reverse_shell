import * as net from 'net';

const scanPort = (host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(2000); // Timeout after 2 seconds

    socket.on('connect', () => {
      resolve(true);
      socket.destroy(); // Clean up socket
    });

    socket.on('timeout', () => {
      resolve(false);
      socket.destroy(); // Clean up socket
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
};


export const scanPorts = async (host: string, startPort: number, endPort: number) => {
  const results: { port: number; isOpen: boolean }[] = [];

  for (let port = startPort; port <= endPort; port++) {
    const isOpen = await scanPort(host, port);
    results.push({ port, isOpen });
  }

  return results;
};


