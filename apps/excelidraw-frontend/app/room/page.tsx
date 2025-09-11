// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { HTTP_BACKEND } from "@/config";
// import { ArrowLeft, Users, Plus, Palette, Sparkles, XCircle, Lock, Key } from "lucide-react";
// import { ThemeToggle } from "@/components/ThemeToggle";

// export default function RoomPage() {
//   const [roomName, setRoomName] = useState("");
//   const [roomPassword, setRoomPassword] = useState("");
//   const [isJoining, setIsJoining] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{[key: string]: string}>({});
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();

//   // Check authentication and get user info
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const authUser = localStorage.getItem("authUser");
    
//     if (!token) {
//       router.push("/signin");
//       return;
//     }

//     if (authUser) {
//       try {
//         setUser(JSON.parse(authUser));
//       } catch (e) {
//         console.error("Failed to parse user data");
//         router.push("/signin");
//       }
//     }
//   }, [router]);

//   const handleCreateRoom = async () => {
//     setErrors({});
    
//     if (!roomName.trim()) {
//       setErrors({ roomName: "Please enter a room name" });
//       return;
//     }

//     if (roomName.length < 3) {
//       setErrors({ roomName: "Room name must be at least 3 characters" });
//       return;
//     }

//     if (roomName.length > 30) {
//       setErrors({ roomName: "Room name must be less than 30 characters" });
//       return;
//     }

//     if (!/^[a-zA-Z0-9\s-_]+$/.test(roomName)) {
//       setErrors({ roomName: "Room name can only contain letters, numbers, spaces, hyphens, and underscores" });
//       return;
//     }

//     if (roomPassword && roomPassword.length < 4) {
//       setErrors({ roomPassword: "Password must be at least 4 characters" });
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setErrors({ general: "Please sign in first." });
//       router.push("/signin");
//       return;
//     }

//     setLoading(true);

//     try {
//       const roomResponse = await axios.post(`${HTTP_BACKEND}/room`, {
//         name: roomName,
//         password: roomPassword || undefined
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const roomSlug = roomResponse.data.roomSlug;
//       router.push(`/room/${roomSlug}`);
//     } catch (error) {
//       console.error(error);
//       if (axios.isAxiosError(error)) {
//         const errorData = error.response?.data;
        
//         if (errorData?.errors) {
//           setErrors(errorData.errors);
//         } else if (error.response?.status === 403) {
//           setErrors({ general: "Session expired. Please sign in again." });
//           localStorage.removeItem("token");
//           localStorage.removeItem("authUser");
//           router.push("/signin");
//         } else if (error.response?.status === 411) {
//           // Room already exists, suggest joining instead
//           setErrors({ 
//             general: `Room "${roomName}" already exists! You can join it instead or choose a different name.`,
//             roomName: "This room name is already taken"
//           });
//           setIsJoining(true); // Switch to join mode automatically
//         } else if (error.response?.status === 400) {
//           setErrors({ general: errorData?.message || "Invalid input. Please check your room name." });
//         } else {
//           setErrors({ general: "Failed to create room. Please try again." });
//         }
//       } else {
//         setErrors({ general: "Network error. Please check your connection." });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleJoinRoom = async () => {
//     setErrors({});
    
//     if (!roomName.trim()) {
//       setErrors({ roomName: "Please enter a room name" });
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setErrors({ general: "Please sign in first." });
//       router.push("/signin");
//       return;
//     }

//     setLoading(true);

//     try {
//       const joinResponse = await axios.post(`${HTTP_BACKEND}/room/join`, {
//         name: roomName,
//         password: roomPassword || undefined
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const roomSlug = joinResponse.data.roomSlug;
//       router.push(`/room/${roomSlug}`);
//     } catch (error) {
//       console.error(error);
//       if (axios.isAxiosError(error)) {
//         const errorData = error.response?.data;
        
//         if (errorData?.errors) {
//           setErrors(errorData.errors);
//         } else if (error.response?.status === 404) {
//           setErrors({ roomName: "Room not found. Please check the room name." });
//         } else if (error.response?.status === 403) {
//           setErrors({ roomPassword: "Incorrect room password." });
//         } else if (error.response?.status === 400) {
//           setErrors({ general: errorData?.message || "Invalid input." });
//         } else {
//           setErrors({ general: "Failed to join room. Please try again." });
//         }
//       } else {
//         setErrors({ general: "Network error. Please check your connection." });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen animated-gradient flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
//           <p className="text-white/80">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen clean-bg-primary flex items-center justify-center p-4">
      
//       <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
//         <button
//           onClick={() => router.push("/")}
//           className="p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-lg"
//           aria-label="Go back"
//         >
//           <ArrowLeft className="h-5 w-5 text-slate-300" />
//         </button>
//         {/* <ThemeToggle /> */}
//       </div>
      
//       <div className="w-full max-w-lg relative z-10">
//         <div className="relative">
//           <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-2xl opacity-30" />
//           <div className="relative bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8">
            
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-50" />
//                 <div className="relative w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-xl">
//                   <Users className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//               <h2 className="text-3xl font-bold mb-2 text-white">
//                 {isJoining ? "Join Workspace" : "Create Your Space"}
//               </h2>
//               <p className="text-white/80 mb-4">
//                 Welcome back, <span className="font-semibold text-white">{user.name}</span>!
//               </p>
//               <p className="text-sm text-slate-400">
//                 {isJoining ? "Enter room details to join" : "Start a new collaborative drawing session"}
//               </p>
//             </div>

//             {/* Toggle between Create and Join */}
//             <div className="flex mb-6 bg-slate-700 rounded-lg p-1 border border-slate-600">
//               <button
//                 onClick={() => setIsJoining(false)}
//                 className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
//                   !isJoining 
//                     ? 'bg-blue-600 text-white shadow-lg' 
//                     : 'text-slate-300 hover:text-white hover:bg-slate-600'
//                 }`}
//               >
//                 Create Room
//               </button>
//               <button
//                 onClick={() => setIsJoining(true)}
//                 className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
//                   isJoining 
//                     ? 'bg-blue-600 text-white shadow-lg' 
//                     : 'text-slate-300 hover:text-white hover:bg-slate-600'
//                 }`}
//               >
//                 Join Room
//               </button>
//             </div>

//             {/* Error Display */}
//             {errors.general && (
//               <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
//                 <p className="text-red-300 text-sm font-medium flex items-center gap-2">
//                   <XCircle className="h-4 w-4" />
//                   {errors.general}
//                 </p>
//               </div>
//             )}

//             <form onSubmit={(e) => { 
//               e.preventDefault(); 
//               isJoining ? handleJoinRoom() : handleCreateRoom(); 
//             }} className="space-y-6">
              
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-white">
//                   Room Name
//                 </label>
//                 <div className="relative">
//                   <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
//                   <input
//                     type="text"
//                     placeholder="e.g., Team Brainstorm, Design Review"
//                     value={roomName}
//                     onChange={(e) => setRoomName(e.target.value)}
//                     className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
//                       errors.roomName ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
//                     }`}
//                     disabled={loading}
//                     maxLength={30}
//                   />
//                 </div>
//                 {errors.roomName && (
//                   <p className="text-red-300 text-sm font-medium flex items-center gap-1">
//                     <XCircle className="h-4 w-4" />
//                     {errors.roomName}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-white">
//                   Room Password {!isJoining && <span className="text-white/60">(Optional)</span>}
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
//                   <input
//                     type="password"
//                     placeholder={isJoining ? "Enter room password" : "Set room password (optional)"}
//                     value={roomPassword}
//                     onChange={(e) => setRoomPassword(e.target.value)}
//                     className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
//                       errors.roomPassword ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
//                     }`}
//                     disabled={loading}
//                     maxLength={20}
//                   />
//                 </div>
//                 {errors.roomPassword && (
//                   <p className="text-red-300 text-sm font-medium flex items-center gap-1">
//                     <XCircle className="h-4 w-4" />
//                     {errors.roomPassword}
//                   </p>
//                 )}
//                 <p className="text-xs text-slate-400">
//                   {isJoining 
//                     ? "Enter the password provided by the room creator"
//                     : "Set a password to make your room private (4-20 characters)"
//                   }
//                 </p>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading || !roomName.trim()}
//                   className="group relative w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//                 >
//                   <span className="relative z-10 flex items-center justify-center">
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//                         {isJoining ? "Joining Room..." : "Creating Room..."}
//                       </>
//                     ) : (
//                       <>
//                         {isJoining ? (
//                           <>
//                             Join Room
//                             <Key className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
//                           </>
//                         ) : (
//                           <>
//                             Create & Start Drawing
//                             <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
//                           </>
//                         )}
//                       </>
//                     )}
//                   </span>
//                 </button>
//               </div>
//             </form>

//             {/* Sign out */}
//             <div className="mt-8 text-center">
//               <button
//                 onClick={() => {
//                   localStorage.removeItem("token");
//                   localStorage.removeItem("authUser");
//                   router.push("/signin");
//                 }}
//                 className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium"
//               >
//                 Sign out
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Users, Plus, Palette, Sparkles, XCircle, Lock, Key } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RoomPage() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check authentication and get user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("authUser");
    
    if (!token) {
      router.push("/signin");
      return;
    }

    if (authUser) {
      try {
        setUser(JSON.parse(authUser));
      } catch (e) {
        console.error("Failed to parse user data");
        router.push("/signin");
      }
    }
  }, [router]);

  const handleCreateRoom = async () => {
    setErrors({});
    
    if (!roomName.trim()) {
      setErrors({ roomName: "Please enter a room name" });
      return;
    }

    if (roomName.length < 3) {
      setErrors({ roomName: "Room name must be at least 3 characters" });
      return;
    }

    if (roomName.length > 30) {
      setErrors({ roomName: "Room name must be less than 30 characters" });
      return;
    }

    if (!/^[a-zA-Z0-9\s-_]+$/.test(roomName)) {
      setErrors({ roomName: "Room name can only contain letters, numbers, spaces, hyphens, and underscores" });
      return;
    }

    if (roomPassword && roomPassword.length < 4) {
      setErrors({ roomPassword: "Password must be at least 4 characters" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ general: "Please sign in first." });
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const roomResponse = await axios.post(`${HTTP_BACKEND}/room`, {
        name: roomName,
        password: roomPassword || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const roomSlug = roomResponse.data.roomSlug;
      router.push(`/room/${roomSlug}`);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          setErrors(errorData.errors);
        } else if (error.response?.status === 403) {
          setErrors({ general: "Session expired. Please sign in again." });
          localStorage.removeItem("token");
          localStorage.removeItem("authUser");
          router.push("/signin");
        } else if (error.response?.status === 411) {
          // Room already exists, suggest joining instead
          setErrors({ 
            general: `Room "${roomName}" already exists! You can join it instead or choose a different name.`,
            roomName: "This room name is already taken"
          });
          setIsJoining(true); // Switch to join mode automatically
        } else if (error.response?.status === 400) {
          setErrors({ general: errorData?.message || "Invalid input. Please check your room name." });
        } else {
          setErrors({ general: "Failed to create room. Please try again." });
        }
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    setErrors({});
    
    if (!roomName.trim()) {
      setErrors({ roomName: "Please enter a room name" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ general: "Please sign in first." });
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const joinResponse = await axios.post(`${HTTP_BACKEND}/room/join`, {
        name: roomName,
        password: roomPassword || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const roomSlug = joinResponse.data.roomSlug;
      router.push(`/room/${roomSlug}`);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          setErrors(errorData.errors);
        } else if (error.response?.status === 404) {
          setErrors({ roomName: "Room not found. Please check the room name." });
        } else if (error.response?.status === 403) {
          setErrors({ roomPassword: "Incorrect room password." });
        } else if (error.response?.status === 400) {
          setErrors({ general: errorData?.message || "Invalid input." });
        } else {
          setErrors({ general: "Failed to join room. Please try again." });
        }
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen clean-bg-primary flex items-center justify-center p-4">
      
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-3 z-50">
        <button
          onClick={() => router.push("/")}
          className="p-2 sm:p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-lg"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
        </button>
        {/* <ThemeToggle /> */}
      </div>
      
      <div className="w-full max-w-xs sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-2xl opacity-30" />
          <div className="relative bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-6 sm:p-8">
            
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-50" />
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-xl">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                {isJoining ? "Join Workspace" : "Create Your Space"}
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-4">
                Welcome back, <span className="font-semibold text-white">{user.name}</span>!
              </p>
              <p className="text-sm text-slate-400">
                {isJoining ? "Enter room details to join" : "Start a new collaborative drawing session"}
              </p>
            </div>

            {/* Toggle between Create and Join */}
            <div className="flex mb-6 bg-slate-700 rounded-lg p-1 border border-slate-600">
              <button
                onClick={() => setIsJoining(false)}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  !isJoining 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                Create Room
              </button>
              <button
                onClick={() => setIsJoining(true)}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  isJoining 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                Join Room
              </button>
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              isJoining ? handleJoinRoom() : handleCreateRoom(); 
            }} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Room Name
                </label>
                <div className="relative">
                  <Plus className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="e.g., Team Brainstorm, Design Review"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${
                      errors.roomName ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
                    }`}
                    disabled={loading}
                    maxLength={30}
                  />
                </div>
                {errors.roomName && (
                  <p className="text-red-300 text-xs sm:text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.roomName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Room Password {!isJoining && <span className="text-white/60">(Optional)</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                  <input
                    type="password"
                    placeholder={isJoining ? "Enter room password" : "Set room password (optional)"}
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${
                      errors.roomPassword ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
                    }`}
                    disabled={loading}
                    maxLength={20}
                  />
                </div>
                {errors.roomPassword && (
                  <p className="text-red-300 text-xs sm:text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.roomPassword}
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  {isJoining 
                    ? "Enter the password provided by the room creator"
                    : "Set a password to make your room private (4-20 characters)"
                  }
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !roomName.trim()}
                  className="group relative w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2" />
                        {isJoining ? "Joining Room..." : "Creating Room..."}
                      </>
                    ) : (
                      <>
                        {isJoining ? (
                          <>
                            Join Room
                            <Key className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                          </>
                        ) : (
                          <>
                            Create & Start Drawing
                            <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                          </>
                        )}
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Sign out */}
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("authUser");
                  router.push("/signin");
                }}
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}