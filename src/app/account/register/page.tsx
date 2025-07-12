'use client';

import { AuthForm } from "@/components/auth-form"
import { useState } from "react"

export default function RegisterPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');

  const handleModeSwitch = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    
    // Update URL without page reload
    const newPath = newMode === 'login' ? '/account/login' : '/account/register';
    window.history.pushState({}, '', newPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <AuthForm mode={mode} onModeSwitch={handleModeSwitch} />
      </div>
    </div>
  )
}