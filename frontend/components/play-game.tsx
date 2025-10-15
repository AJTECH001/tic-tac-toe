"use client";

import { Game, Move } from "@/lib/contract";
import { GameBoard } from "./game-board";
import { abbreviateAddress, explorerAddress, formatStx } from "@/lib/stx-utils";
import Link from "next/link";
import { useStacks } from "@/hooks/use-stacks";
import { useState } from "react";

interface PlayGameProps {
  game: Game;
}

export function PlayGame({ game }: PlayGameProps) {
  const { userData, handleJoinGame, handlePlayGame } = useStacks();

  // Initial game board is the current `game.board` state
  const [board, setBoard] = useState(game.board);
  const [playedMoveIndex, setPlayedMoveIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is not logged in, show connect prompt
  if (!userData) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <span className="text-2xl">🔗</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground mb-6">
          Connect your Stacks wallet to join or play games
        </p>
      </div>
    );
  }

  const isPlayerOne = userData.profile.stxAddress.testnet === game["player-one"];
  const isPlayerTwo = userData.profile.stxAddress.testnet === game["player-two"];
  const isJoinable = game["player-two"] === null && !isPlayerOne;
  const isJoinedAlready = isPlayerOne || isPlayerTwo;
  const nextMove = game["is-player-one-turn"] ? Move.X : Move.O;
  const isMyTurn = (game["is-player-one-turn"] && isPlayerOne) || (!game["is-player-one-turn"] && isPlayerTwo);
  const isGameOver = game.winner !== null;

  function onCellClick(index: number) {
    if (isGameOver) return;
    
    const tempBoard = [...game.board];
    tempBoard[index] = nextMove;
    setBoard(tempBoard);
    setPlayedMoveIndex(index);
  }

  async function handleJoin() {
    if (playedMoveIndex === -1) {
      window.alert("Please select your move first");
      return;
    }
    setIsSubmitting(true);
    try {
      await handleJoinGame(game.id, playedMoveIndex, nextMove);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePlay() {
    if (playedMoveIndex === -1) {
      window.alert("Please select your move first");
      return;
    }
    setIsSubmitting(true);
    try {
      await handlePlayGame(game.id, playedMoveIndex, nextMove);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getGameStatus = () => {
    if (isGameOver) {
      return (
        <div className="flex items-center space-x-2 text-red-400">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="font-semibold">Game Over</span>
        </div>
      );
    }
    
    if (isJoinable) {
      return (
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="font-semibold">Waiting for Player 2</span>
        </div>
      );
    }
    
    if (isMyTurn) {
      return (
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-semibold">Your Turn</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
        <span>Waiting for opponent</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Game Board Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Game Board</h2>
          {getGameStatus()}
        </div>
        
        <div className="flex justify-center mb-6">
          <GameBoard
            board={board}
            onCellClick={onCellClick}
            nextMove={nextMove}
            cellClassName="w-24 h-24 text-4xl"
            disabled={isGameOver || (!isMyTurn && !isJoinable)}
          />
        </div>

        {/* Game Actions */}
        {!isGameOver && (
          <div className="space-y-4">
            {isJoinable && (
              <button
                onClick={handleJoin}
                disabled={playedMoveIndex === -1 || isSubmitting}
                className="btn btn-primary btn-lg w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Joining Game...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Join Game
                  </>
                )}
              </button>
            )}

            {isMyTurn && (
              <button
                onClick={handlePlay}
                disabled={playedMoveIndex === -1 || isSubmitting}
                className="btn btn-primary btn-lg w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Playing Move...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🎯</span>
                    Play Move
                  </>
                )}
              </button>
            )}

            {playedMoveIndex === -1 && (isMyTurn || isJoinable) && (
              <p className="text-sm text-muted-foreground text-center">
                Click on the board to select your move
              </p>
            )}
          </div>
        )}
      </div>

      {/* Game Info Section */}
      <div className="space-y-6">
        {/* Game Details */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Game Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Game ID:</span>
              <span className="font-mono text-sm">#{game.id}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bet Amount:</span>
              <span className="font-semibold">{formatStx(game["bet-amount"])} STX</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Prize:</span>
              <span className="font-semibold text-primary">{formatStx(game["bet-amount"] * 2)} STX</span>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Players
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Player 1 (X):</span>
              <Link
                href={explorerAddress(game["player-one"])}
                target="_blank"
                className="font-mono text-sm hover:text-primary transition-colors"
              >
                {abbreviateAddress(game["player-one"])}
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Player 2 (O):</span>
              {game["player-two"] ? (
                <Link
                  href={explorerAddress(game["player-two"])}
                  target="_blank"
                  className="font-mono text-sm hover:text-primary transition-colors"
                >
                  {abbreviateAddress(game["player-two"])}
                </Link>
              ) : (
                <span className="text-muted-foreground">Waiting...</span>
              )}
            </div>
          </div>
        </div>

        {/* Winner */}
        {game["winner"] && (
          <div className="card p-6 bg-green-500/10 border-green-500/20">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-green-400">
              <span className="mr-2">🏆</span>
              Winner
            </h3>
            <Link
              href={explorerAddress(game["winner"])}
              target="_blank"
              className="font-mono text-sm hover:text-primary transition-colors"
            >
              {abbreviateAddress(game["winner"])}
            </Link>
            <p className="text-sm text-green-400/80 mt-2">
              Won {formatStx(game["bet-amount"] * 2)} STX!
            </p>
          </div>
        )}

        {/* Back to Games */}
        <div className="text-center">
          <Link href="/" className="btn btn-ghost">
            ← Back to All Games
          </Link>
        </div>
      </div>
    </div>
  );
}
