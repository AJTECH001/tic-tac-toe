"use client";

import { Move } from "@/lib/contract";
import { useState } from "react";

type GameBoardProps = {
  board: Move[];
  onCellClick?: (index: number) => void;
  cellClassName?: string;
  nextMove?: Move;
  disabled?: boolean;
};

export function GameBoard({
  board,
  onCellClick,
  nextMove,
  cellClassName = "w-16 h-16 text-2xl",
  disabled = false,
}: GameBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const getCellContent = (cell: Move, index: number) => {
    if (cell === Move.EMPTY) {
      if (hoveredCell === index && nextMove && !disabled) {
        return (
          <span className="text-muted-foreground/50 animate-pulse">
            {nextMove === Move.X ? "X" : "O"}
          </span>
        );
      }
      return null;
    }
    
    return (
      <span className={`transition-all duration-300 ${
        cell === Move.X 
          ? "text-blue-400 drop-shadow-lg" 
          : "text-red-400 drop-shadow-lg"
      }`}>
        {cell === Move.X ? "X" : "O"}
      </span>
    );
  };

  const getCellClasses = (cell: Move, index: number) => {
    const baseClasses = "relative border-2 rounded-lg flex items-center justify-center font-bold transition-all duration-200";
    const interactiveClasses = disabled ? "" : "cursor-pointer hover:scale-105 active:scale-95";
    
    let stateClasses = "";
    if (cell === Move.EMPTY) {
      if (hoveredCell === index && !disabled) {
        stateClasses = "border-primary/50 bg-primary/5";
      } else {
        stateClasses = "border-border bg-card hover:border-primary/30 hover:bg-accent/50";
      }
    } else {
      stateClasses = "border-border bg-card shadow-md";
    }

    return `${baseClasses} ${interactiveClasses} ${stateClasses} ${cellClassName}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-3 p-4 bg-card/50 rounded-xl border">
        {board.map((cell, index) => (
          <div
            key={index}
            className={getCellClasses(cell, index)}
            onClick={() => !disabled && onCellClick?.(index)}
            onMouseEnter={() => !disabled && setHoveredCell(index)}
            onMouseLeave={() => !disabled && setHoveredCell(null)}
          >
            {getCellContent(cell, index)}
            
            {/* Winning line indicator */}
            {cell !== Move.EMPTY && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            )}
          </div>
        ))}
      </div>
      
      {/* Game status indicator */}
      {nextMove && !disabled && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span>Your turn: <span className="font-semibold text-foreground">
            {nextMove === Move.X ? "X" : "O"}
          </span></span>
        </div>
      )}
    </div>
  );
}
