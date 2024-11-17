import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface PasswordProtectProps {
  onAuthenticated: () => void;
}

export const PasswordProtect = ({ onAuthenticated }: PasswordProtectProps) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "neva") {
      onAuthenticated();
      localStorage.setItem("authenticated", "true");
    } else {
      toast.error("Nesprávne heslo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Zadajte heslo pre prístup
          </h2>
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