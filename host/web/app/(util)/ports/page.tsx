"use client"

import PortsTable from "@/components/component/PortsTable";
import React from "react";

const page = () => {
  return <PortsTable target="host" startPort={0} endPort={6000}/>;
};

export default page;
