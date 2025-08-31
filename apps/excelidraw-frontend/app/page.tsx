import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Sparkles, Github, Download, Palette, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-slate-600/10 dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-slate-400/5" />
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Palette className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent">
                Collaborative
              </span>
              <br />
              <span className="text-foreground">Whiteboarding</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-600 bg-clip-text text-transparent">
                Made Beautiful
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Create stunning diagrams, sketches, and collaborate in real-time with our 
              intuitive drawing platform. Express your ideas with style.
            </p>
            
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
              <Link
                href="/signin"
                className="group relative inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 text-white text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center">
                  Start Creating
                  <Pencil className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link 
                href="/signup" 
                className="group inline-flex items-center justify-center h-14 px-8 rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/10"
              >
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Join Free
                </span>
                <Zap className="ml-2 h-5 w-5 text-blue-600 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of collaborative design with our cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card  
              title=""
              href="#"
              className="group p-8 border-2 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="text-center">
                <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Share2 className="h-8 w-8 text-white" />
                </div> 
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-time Sync</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Watch your ideas come to life as you and your team collaborate seamlessly in real-time across any device.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card  
              title=""
              href="#"
              className="group p-8 border-2 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              <div className="text-center">
                <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Users2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Spaces</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Create dedicated rooms for your projects. Invite team members and watch productivity soar.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card   
              title=""
              href="#"
              className="group p-8 border-2 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-slate-500/20"
            >
              <div className="text-center">
                <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-slate-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Tools</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Intelligent drawing tools with shape recognition, auto-alignment, and professional styling options.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-slate-600/5 dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-slate-400/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Built for Modern Teams
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Our platform combines the simplicity of traditional whiteboards with the power of modern technology.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
                    <p className="text-muted-foreground">Your data is encrypted and secure. Only invited team members can access your rooms.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
                    <p className="text-muted-foreground">Optimized for speed with instant synchronization and smooth drawing experience.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Beautiful Design</h3>
                    <p className="text-muted-foreground">Carefully crafted interface that inspires creativity and enhances productivity.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-200 dark:border-blue-700">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full w-3/4" />
                  <div className="h-4 bg-gradient-to-r from-indigo-400 to-slate-400 rounded-full w-1/2" />
                  <div className="h-4 bg-gradient-to-r from-slate-400 to-blue-400 rounded-full w-5/6" />
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl opacity-80" />
                    <div className="h-16 bg-gradient-to-br from-indigo-500 to-slate-500 rounded-xl opacity-80" />
                    <div className="h-16 bg-gradient-to-br from-slate-500 to-blue-500 rounded-xl opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl p-8 sm:p-16 shadow-2xl">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Ready to Transform Your Ideas?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-xl text-white/90 leading-relaxed">
                  Join thousands of creators, designers, and teams who are already bringing their visions to life.
                </p>
                <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-xl hover:shadow-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Start Drawing Free
                    <Pencil className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 DrawTogether. Crafted with love.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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