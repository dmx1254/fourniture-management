"use client";

import React from "react";
import { Button } from "./ui/button";

const UpdateButton = () => {
  const updateRole = async () => {
    const response = await fetch("/api/user/updateRole", {
      method: "POST",
      body: JSON.stringify({ role: "admin" }),
    });
  };
  return <Button onClick={updateRole}>update role</Button>;
};

export default UpdateButton;
