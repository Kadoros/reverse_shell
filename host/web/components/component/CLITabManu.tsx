import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CLI from "./CLI";
import ConnectionTableForD from "@/components/component/ConnectionTableForD";

interface Tab {
  id: string;
  label: string;
  terminalLines: JSX.Element[]; // Store terminal lines for each tab
}

const TabsManu: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleCommandLine = (ip: string, isOnline: boolean) => {
    addTab(ip, isOnline, "CLI");
  };

  const handleRemoteControl = (ip: string, isOnline: boolean) => {
    addTab(ip, isOnline, "RC");
  };

  const handleBoth = (ip: string, isOnline: boolean) => {
    addTab(ip, isOnline, "CLI");
    addTab(ip, isOnline, "RC");
  };

  const addTab = (ip: string, isOnline: boolean, type: string) => {
    const newTabId = `tab-${tabs.length + 1}`;
    const newTab: Tab = {
      id: newTabId,
      label: `${type}: ${ip}`,
      terminalLines: [], // Initialize empty terminal lines
    };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(newTabId); // Set the new tab as active
  };

  const updateTerminalLines = (tabId: string, lines: JSX.Element[]) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId ? { ...tab, terminalLines: lines } : tab
      )
    );
  };

  const closeTab = (tabId: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(updatedTabs);

    if (activeTab === tabId) {
      setActiveTab(updatedTabs.length > 0 ? updatedTabs[0].id : null); // Switch to the first tab if the active one is closed
    }
  };

  return (
    <Dialog>
      <div className="w-full mx-auto p-4 max-w-6xl">
        <div className="relative">
          <div className="flex overflow-x-auto space-x-2 border-b-2 border-gray-200 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
            {tabs.length > 0 ? (
              tabs.map((tab) => (
                <div key={tab.id} className="flex items-center space-x-2">
                  <button
                    className={`px-4 py-2 rounded-md transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gray-900 text-white shadow-md"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600 transition duration-200"
                    onClick={() => closeTab(tab.id)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No tabs available</div>
            )}
            <DialogTrigger asChild>
              <button className="ml-auto px-3 py-2 text-sm text-white bg-slate-500 rounded-md shadow hover:bg-green-600 transition-all duration-200">
                + New Tab
              </button>
            </DialogTrigger>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-md shadow-inner">
          {activeTab && tabs.length > 0 ? (
            <CLI
              key={activeTab} // Ensure unique key for each CLI instance
              IP={tabs.find((tab) => tab.id === activeTab)?.label.split(": ")[1] || ""}
              isOnline={true} // Adjust based on your logic
              terminalLines={tabs.find((tab) => tab.id === activeTab)?.terminalLines || []}
              updateTerminalLines={(lines) => updateTerminalLines(activeTab!, lines)}
            />
          ) : (
            <div className="text-gray-400">Please select a tab</div>
          )}
        </div>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <ConnectionTableForD
          onCommandLine={handleCommandLine}
          onRemoteControl={handleRemoteControl}
          onBoth={handleBoth}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TabsManu;
