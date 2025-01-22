"use client";

import React, { useState } from "react";
import TopBar from "./TopBar";

export default function ClientTopBarWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/images/customer.webp");

  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  //   setUserAvatar("/path/to/your/avatar.png");
  // };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserAvatar("/images/customer.webp");
  };

  return (
    <TopBar
      isLoggedIn={isLoggedIn}
      userAvatar={userAvatar}
      onLogout={handleLogout}
    />
  );
}
