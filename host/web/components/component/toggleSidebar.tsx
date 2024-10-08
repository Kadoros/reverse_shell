"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
} from "lucide-react";
import { ArrowsUpDownIcon, CommnadLineIcon } from "@/components/icons";
import Link from "next/link";

interface SidebarItem {
  icon: React.FC<any>; // Using a React functional component type
  label: string;
  dir: string;
}

interface ToggleSidebarProps {
  children: ReactNode;
}

export default function ToggleSidebar({ children }: ToggleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Home", dir: "/" },
    { icon: ArrowsUpDownIcon, label: "Connections", dir: "/connections" },
    { icon: CommnadLineIcon, label: "Command Line", dir: "/cmd" },
    { icon: Settings, label: "Settings", dir: "/settings" },
    { icon: HelpCircle, label: "Help", dir: "/help" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-gray-700"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 px-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link href={item.dir} passHref>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-gray-700 transition-all duration-300 ease-in-out ${
                      isOpen ? "px-4" : "px-0 justify-center"
                    }`}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span
                      className={`ml-2 transition-all duration-300 ease-in-out ${
                        isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                      } overflow-hidden whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
