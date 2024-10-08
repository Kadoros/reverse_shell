import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowsUpDownIcon } from "@/components/icons";

interface ConnectionHeaderProps {
  IP: string;
  isOnline: boolean;
}

const ConnectionHeader = ({ IP, isOnline }: ConnectionHeaderProps) => {
  return (
    <header className="border-2 dark:border-zinc-700 p-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Avatar className="relative overflow-visible w-10 h-10">
          {/* <span
            className={`absolute right-0 top-0 flex h-3 w-3 rounded-full ${
              isOnline ? "bg-green-600" : "bg-red-600"
            } `}
          /> */}

          <ArrowsUpDownIcon />
        </Avatar>
        <div>
          {IP}
          <span
            className={`text-xs block ${
              isOnline ? "text-green-600" : "text-red-600"
            }  `}
          >
            {isOnline ? "Online" : "Offline"}{" "}
          </span>
        </div>
      </h2>
    </header>
  );
};

export default ConnectionHeader;
