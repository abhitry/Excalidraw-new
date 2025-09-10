import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Sparkles, Github, Download, Palette, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen clean-bg-primary">
      {/* <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div> */}
      
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl opacity-50" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="block">
                Collaborative
              </span>
              <span className="block">
                Whiteboarding
              </span>
              <span className="block">
                Made Beautiful
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-md sm:max-w-xl md:max-w-2xl text-lg sm:text-xl text-white/90 leading-relaxed">
              Create stunning diagrams, sketches, and collaborate in real-time with our 
              intuitive drawing platform. Express your ideas with style.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
                <Link
                href="/signin"
                className="group relative inline-flex items-center justify-center h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Creating
                  <Pencil className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>

              
              <Link 
                href="/signup" 
                className="group inline-flex items-center justify-center h-14 px-8 rounded-xl border-2 border-slate-600 bg-transparent hover:bg-slate-700 text-lg font-semibold transition-all duration-200 text-white w-full sm:w-auto"
              >
                <span>Join Free</span>
                <Zap className="ml-2 h-5 w-5 group-hover:text-yellow-300 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-md sm:max-w-2xl mx-auto">
              Experience the future of collaborative design with our cutting-edge features
            </p>
          </div>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <Card  
              title=""
              href="#"
              className="group p-6 sm:p-8 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 bg-slate-800 rounded-xl shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-200">
                  <Share2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div> 
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Real-time Sync</h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  Watch your ideas come to life as you and your team collaborate seamlessly in real-time across any device.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card  
              title=""
              href="#"
              className="group p-6 sm:p-8 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 bg-slate-800 rounded-xl shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-200">
                  <Users2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Team Spaces</h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  Create dedicated rooms for your projects. Invite team members and watch productivity soar.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card   
              title=""
              href="#"
              className="group p-6 sm:p-8 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 bg-slate-800 rounded-xl shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-200">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Smart Tools</h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  Intelligent drawing tools with shape recognition, auto-alignment, and professional styling options.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* 🔥 Adjusted grid gap for mobile & desktop */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Built for Modern Teams
              </h2>
              {/* 🔥 Responsive font size */}
              <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-md sm:max-w-lg">
                Our platform combines the simplicity of traditional whiteboards with the power of modern technology.
              </p>
              {/* 🔥 Adjusted max-width for readability on mobile */}

              <div className="space-y-4 sm:space-y-6">
                {/* 🔥 Reduced spacing on mobile */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Secure & Private</h3>
                    <p className="text-sm sm:text-base text-slate-300">
                      Your data is encrypted and secure. Only invited team members can access your rooms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Lightning Fast</h3>
                    <p className="text-sm sm:text-base text-slate-300">
                      Optimized for speed with instant synchronization and smooth drawing experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Beautiful Design</h3>
                    <p className="text-sm sm:text-base text-slate-300">
                      Carefully crafted interface that inspires creativity and enhances productivity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-2xl opacity-30" />
              <div className="relative bg-slate-700 border border-slate-600 rounded-2xl p-6 sm:p-8 lg:p-8 shadow-xl">
                <div className="space-y-2 sm:space-y-4">
                  <div className="h-3 sm:h-4 bg-slate-600 rounded-full w-3/4" />
                  <div className="h-3 sm:h-4 bg-slate-600 rounded-full w-1/2" />
                  <div className="h-3 sm:h-4 bg-slate-600 rounded-full w-5/6" />
                  <div className="mt-4 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="h-12 sm:h-16 bg-slate-600 rounded-lg" />
                    <div className="h-12 sm:h-16 bg-slate-600 rounded-lg" />
                    <div className="h-12 sm:h-16 bg-slate-600 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-2xl" />
            <div className="relative bg-slate-800 border border-slate-600 rounded-2xl p-6 sm:p-12 lg:p-20 shadow-xl">
              <div className="mx-auto max-w-md sm:max-w-xl lg:max-w-2xl text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Ready to Transform Your Ideas?
                </h2>
                <p className="mx-auto mt-4 sm:mt-8 max-w-xs sm:max-w-lg lg:max-w-xl text-lg sm:text-xl text-slate-300 leading-relaxed">
                  Join thousands of creators, designers, and teams who are already bringing their visions to life.
                </p>
                <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center justify-center h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Drawing Free
                      <Pencil className="ml-2 h-5 w-5 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-transparent text-white border-2 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-lg font-semibold transition-all duration-200 w-full sm:w-auto"
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
      <footer className="border-t border-slate-600 bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-6 sm:py-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <p className="text-sm sm:text-base text-slate-400">
                © 2025 DrawTogether. Crafted with love.
              </p>
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="https://github.com/abhitry" className="text-slate-400 hover:text-white transition-colors">
                <Github className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Download className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;