"use client";

import { Game } from "@/lib/contract";
import Link from "next/link";
import { GameBoard } from "./game-board";
import { useStacks } from "@/hooks/use-stacks";
import { useMemo } from "react";
import { formatStx, abbreviateAddress } from "@/lib/stx-utils";

type GameCardProps = {
  game: Game;
  gameType: "active" | "joinable" | "ended";
};

function GameCard({ game, gameType }: GameCardProps) {
  const { userData } = useStacks();
  const isPlayer = userData && (
    game["player-one"] === userData.profile.stxAddress.testnet ||
    game["player-two"] === userData.profile.stxAddress.testnet
  );

  const getStatusBadge = () => {
    switch (gameType) {
      case "active":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-green-400">Your Turn</span>
          </div>
        );
      case "joinable":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-xs font-medium text-yellow-400">Joinable</span>
          </div>
        );
      case "ended":
        const winner = game.winner === game["player-one"] ? "X" : "O";
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-red-400">Winner: {winner}</span>
          </div>
        );
    }
  };

  return (
    <Link
      href={`/game/${game.id}`}
      className="group block"
    >
      <div className="card p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-muted-foreground">Game #{game.id}</span>
          {getStatusBadge()}
        </div>
        
        <div className="flex justify-center mb-4">
          <GameBoard
            board={game.board}
            cellClassName="w-8 h-8 text-lg"
            disabled={true}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bet:</span>
            <span className="font-semibold text-foreground">{formatStx(game["bet-amount"])} STX</span>
          </div>
          
          {gameType === "active" && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next:</span>
              <span className="font-semibold text-primary">
                {game["is-player-one-turn"] ? "X" : "O"}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Player 1:</span>
            <span className="font-mono text-foreground">
              {abbreviateAddress(game["player-one"])}
            </span>
          </div>
          
          {game["player-two"] && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Player 2:</span>
              <span className="font-mono text-foreground">
                {abbreviateAddress(game["player-two"])}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <span>Click to {gameType === "joinable" ? "join" : gameType === "ended" ? "view" : "play"}</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ title, description, buttonText, buttonHref }: {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}) {
  return (
    <div className="card p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <span className="text-2xl">🎮</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link href={buttonHref} className="btn btn-primary">
        {buttonText}
      </Link>
    </div>
  );
}

export function GamesList({ games }: { games: Game[] }) {
  const { userData } = useStacks();

  // User Games are games in which the user is a player
  // and a winner has not been decided yet
  const userGames = useMemo(() => {
    if (!userData) return [];
    const userAddress = userData.profile.stxAddress.testnet;
    const filteredGames = games.filter(
      (game) =>
        (game["player-one"] === userAddress ||
          game["player-two"] === userAddress) &&
        game.winner === null
    );
    return filteredGames;
  }, [userData, games]);

  // Joinable games are games in which there still isn't a second player
  // and also the currently logged in user is not the creator of the game
  const joinableGames = useMemo(() => {
    if (!userData) return [];
    const userAddress = userData.profile.stxAddress.testnet;

    return games.filter(
      (game) =>
        game.winner === null &&
        game["player-one"] !== userAddress &&
        game["player-two"] === null
    );
  }, [games, userData]);

  // Ended games are games in which the winner has been decided
  const endedGames = useMemo(() => {
    return games.filter((game) => game.winner !== null);
  }, [games]);

  return (
    <div className="w-full max-w-6xl space-y-12">
      {userData && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Games</h2>
            {userGames.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {userGames.length} game{userGames.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {userGames.length === 0 ? (
            <EmptyState
              title="No Active Games"
              description="You haven't joined any games yet. Create a new game or join an existing one to start playing!"
              buttonText="Create New Game"
              buttonHref="/create"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userGames.map((game) => (
                <GameCard key={`active-${game.id}`} game={game} gameType="active" />
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Joinable Games</h2>
          {joinableGames.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {joinableGames.length} game{joinableGames.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {joinableGames.length === 0 ? (
          <EmptyState
            title="No Joinable Games"
            description="No games are waiting for players right now. Create a new game to start playing!"
            buttonText="Create New Game"
            buttonHref="/create"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {joinableGames.map((game) => (
              <GameCard key={`joinable-${game.id}`} game={game} gameType="joinable" />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Game History</h2>
          {endedGames.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {endedGames.length} game{endedGames.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {endedGames.length === 0 ? (
          <EmptyState
            title="No Game History"
            description="No games have been completed yet. Create a new game to start building your history!"
            buttonText="Create New Game"
            buttonHref="/create"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {endedGames.map((game) => (
              <GameCard key={`ended-${game.id}`} game={game} gameType="ended" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
