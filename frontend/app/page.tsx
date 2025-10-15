import { GamesList } from "@/components/games-list";
import { getAllGames } from "@/lib/contract";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const games = await getAllGames();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Tic Tac Toe
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Play 1v1 Tic Tac Toe on the Stacks blockchain. Bet STX tokens and winner takes all!
          </p>
        </div>

        {/* Demo Mode Notice */}
        {games.length === 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="card p-6 bg-yellow-500/10 border-yellow-500/20">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-500 text-sm">⚠️</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-yellow-400 mb-2">Demo Mode</h3>
                  <p className="text-sm text-yellow-200/80 mb-3">
                    Smart contract not deployed yet. This is a demo of the UI/UX. 
                    Deploy to testnet to start playing with real STX tokens!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/create" className="btn btn-outline btn-sm">
                      Try Create Game
                    </Link>
                    <a 
                      href="https://docs.hiro.so/stacks/clarinet/how-to-guides/how-to-deploy-contracts" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                    >
                      Learn Deployment →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/create" className="btn btn-primary btn-lg">
            <span className="mr-2">🎮</span>
            Create New Game
          </Link>
          <Link href="#games" className="btn btn-outline btn-lg">
            <span className="mr-2">👀</span>
            Browse Games
          </Link>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="mb-16">
        <GamesList games={games} />
      </section>

      {/* Features Section */}
      <section className="text-center py-16 border-t">
        <h2 className="text-3xl font-bold mb-8">Why Play On Stacks?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Transactions</h3>
            <p className="text-sm text-muted-foreground">
              Microblocks enable quick gameplay with transactions confirmed in seconds
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Decentralized</h3>
            <p className="text-sm text-muted-foreground">
              Built on Bitcoin's security with Clarity smart contracts
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Win real STX tokens - winner takes both players' bets
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
