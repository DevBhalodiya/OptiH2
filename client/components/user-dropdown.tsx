'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, type User } from '@/lib/auth-context';
import { ChevronDown, User, LogOut, Settings, Calendar } from 'lucide-react';
import Link from 'next/link';

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
      >
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-white/70">{user.role}</div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-background/95 backdrop-blur-md border border-glass-border rounded-xl shadow-xl z-50">
                     {/* User Info Header */}
           <div className="p-4 border-b border-white/10">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                 <User className="w-6 h-6 text-white" />
               </div>
               <div className="flex-1">
                 <h3 className="font-semibold text-white">{user.name}</h3>
                 <p className="text-sm text-white/70">{user.email}</p>
                 <p className="text-xs text-white/50">{user.role} at {user.company}</p>
               </div>
             </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
              <Calendar className="w-3 h-3" />
              <span>Last login: {formatLastLogin(user.lastLogin)}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span>More Details</span>
            </Link>
            
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
