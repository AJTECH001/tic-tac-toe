"use client";

import { useStacks } from "@/hooks/use-stacks";
import { abbreviateAddress, formatStx } from "@/lib/stx-utils";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { userData, connectWallet, disconnectWallet, stxBalance } = useStacks();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-foreground hover:text-primary transition-colors"
          >
            <span className="text-3xl">🎲</span>
            <span className="hidden sm:inline">TicTacToe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/create" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Create Game
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center space-x-3">
            {userData ? (
              <div className="flex items-center space-x-3">
                {/* Balance Display */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-medium text-foreground">{formatStx(stxBalance)} STX</span>
                </div>
                
                {/* Address */}
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">
                    {abbreviateAddress(userData.profile.stxAddress.testnet)}
                  </span>
                </div>
                
                {/* Disconnect Button */}
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="btn btn-ghost btn-sm text-destructive hover:bg-destructive/10"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={connectWallet}
                className="btn btn-primary btn-md"
              >
                <span className="mr-2">🔗</span>
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn btn-ghost btn-sm"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/create" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Game
            </Link>
            {userData && (
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-medium">{formatStx(stxBalance)} STX</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
