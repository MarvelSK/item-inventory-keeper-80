import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface PasswordProtectProps {
  onAuthenticated: () => void;
}

export const PasswordProtect = ({ onAuthenticated }: PasswordProtectProps) => {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password attempt:", attempts + 1);
    
    if (password === "neva") {
      onAuthenticated();
      localStorage.setItem("authenticated", "true");
      toast.success("Úspešne prihlásený");
    } else {
      setAttempts(prev => prev + 1);
      toast.error(`Nesprávne heslo (pokus ${attempts + 1}/3)`);
      
      if (attempts >= 2) {
        toast.error("Príliš veľa pokusov. Skúste to znova neskôr.", {
          duration: 5000
        });
        setAttempts(0);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src="https://zipscreeny.sk/images/NEVAlogo_blu.png"
            alt="NEVA Logo"
            className="h-16 mb-6"
          />
          <h2 className="text-2xl font-bold text-[#212490]">
            Prihláste sa do systému
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zadajte heslo pre prístup do systému
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#212490] focus:border-[#212490] focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#212490] hover:bg-[#47acc9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#212490]"
            >
              Prihlásiť sa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};