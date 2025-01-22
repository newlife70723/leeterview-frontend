"use client";

import React, { useState } from "react";
import TopBar from "./TopBar";

export default function ClientTopBarWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/customer.webp");

  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  //   setUserAvatar("/path/to/your/avatar.png");
  // };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserAvatar("/customer.webp");
  };

  return (
    <TopBar
      isLoggedIn={isLoggedIn}
      userAvatar={userAvatar}
      onLogout={handleLogout}
    />
  );
}
