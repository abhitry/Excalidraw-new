import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Sparkles, Github, Download } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
              Collaborative Whiteboarding
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent block">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool. 
              No sign-up required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign in
                <Pencil className="ml-2 h-4 w-4" />
              </Link>

              <Link href="/signup" className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-lg font-medium transition-all duration-200 transform hover:scale-105">
                Sign up
              </Link>
             
            </div>
          </div>
        </div>
      </header>

            {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">

            {/* Feature 1 */}
            <Card  title=""
                href="/feature/realtime"
                className="p-6 border-2 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Share2 className="h-6 w-6 text-white" />
                </div> 
                 <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Real-time Collaboration</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Work together with your team in real-time. Share your drawings instantly with a simple link.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card  title=""
                href="/feature/multiplayer"
                className="p-6 border-2 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Users2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Multiplayer Editing</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Multiple users can edit the same canvas simultaneously. See whos drawing what in real-time.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card   title=""
              href="/feature/drawing"
              className="p-6 border-2 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Drawing</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Intelligent shape recognition and drawing assistance helps you create perfect diagrams.
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 sm:p-16 shadow-2xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start creating?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
                Join thousands of users who are already creating amazing diagrams and sketches.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" variant="secondary" className="h-12 px-6 bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg">
                  Open Canvas
                  <Pencil className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-6 bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                  View Gallery
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Excalidraw Clone. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Download className="h-5 w-5" />
                
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;