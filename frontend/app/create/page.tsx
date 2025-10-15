"use client";

import { GameBoard } from "@/components/game-board";
import { useStacks } from "@/hooks/use-stacks";
import { EMPTY_BOARD, Move } from "@/lib/contract";
import { formatStx, parseStx } from "@/lib/stx-utils";
import { useState } from "react";
import Link from "next/link";

export default function CreateGame() {
  const { stxBalance, userData, connectWallet, handleCreateGame } = useStacks();

  const [betAmount, setBetAmount] = useState(0);
  const [selectedMove, setSelectedMove] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function onCellClick(index: number) {
    setSelectedMove(index);
    // Update the board to show the preview
    const tempBoard = [...EMPTY_BOARD];
    tempBoard[index] = Move.X;
    setBoard(tempBoard);
  }

  const [board, setBoard] = useState(EMPTY_BOARD);

  async function onCreateGame() {
    if (selectedMove === null) {
      window.alert("Please select your first move on the board");
      return;
    }
    
    if (betAmount <= 0) {
      window.alert("Please enter a valid bet amount");
      return;
    }

    setIsCreating(true);
    try {
      await handleCreateGame(parseStx(betAmount), selectedMove, Move.X);
    } finally {
      setIsCreating(false);
    }
  }

  const isValidBet = betAmount > 0 && betAmount <= formatStx(stxBalance);
  const canCreateGame = userData && selectedMove !== null && isValidBet && !isCreating;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Create New Game</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Set your bet amount, choose your first move, and create a new Tic Tac Toe game. 
          Other players can join your game and compete for the prize!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game Board Section */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Choose Your First Move
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Click on any empty cell to place your X. This will be your first move when the game starts.
            </p>
            
            <div className="flex justify-center">
              <GameBoard
                board={board}
                onCellClick={onCellClick}
                nextMove={Move.X}
                cellClassName="w-20 h-20 text-3xl"
              />
            </div>
            
            {selectedMove !== null && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  ✓ Move selected: Position {selectedMove + 1}
                </p>
              </div>
            )}
          </div>

          {/* Game Rules */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">📋</span>
              Game Rules
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                You play as X and make the first move
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                Players alternate turns until someone wins or it's a draw
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                Winner takes both bet amounts (2x the stake)
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                Games are played on the Stacks blockchain
              </li>
            </ul>
          </div>
        </div>

        {/* Betting Section */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">💰</span>
              Set Your Bet
            </h2>
            
            <div className="space-y-4">
              {/* Balance Display */}
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Your Balance:</span>
                <span className="font-semibold text-foreground">{formatStx(stxBalance)} STX</span>
              </div>

              {/* Bet Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bet Amount (STX)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={formatStx(stxBalance)}
                    className="input flex-1"
                    placeholder="0.0"
                    value={betAmount || ''}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setBetAmount(formatStx(stxBalance))}
                  >
                    Max
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum bet: 0.000001 STX
                </p>
              </div>

              {/* Bet Preview */}
              {betAmount > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Your bet:</span>
                    <span className="font-semibold">{betAmount} STX</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total prize:</span>
                    <span className="font-semibold text-primary">{betAmount * 2} STX</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="card p-6">
            {userData ? (
              <div className="space-y-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-full"
                  onClick={onCreateGame}
                  disabled={!canCreateGame}
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Game...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🎮</span>
                      Create Game
                    </>
                  )}
                </button>

                {!canCreateGame && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {selectedMove === null && <p>• Select your first move</p>}
                    {betAmount <= 0 && <p>• Enter a valid bet amount</p>}
                    {betAmount > formatStx(stxBalance) && <p>• Insufficient balance</p>}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={connectWallet}
                  className="btn btn-primary btn-lg w-full"
                >
                  <span className="mr-2">🔗</span>
                  Connect Wallet to Create Game
                </button>
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to create and play games
                </p>
              </div>
            )}
          </div>

          {/* Back to Games */}
          <div className="text-center">
            <Link href="/" className="btn btn-ghost">
              ← Back to Games
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
