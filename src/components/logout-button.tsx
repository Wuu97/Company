"use client";
export function LogoutButton() { async function logout() { await fetch("/api/auth/logout", { method: "POST" }); location.href = "/login"; } return <button type="button" className="logout-button" onClick={logout}>退出登录</button>; }
