import { CustomerDialog } from "./CustomerDialog";
import { MobileMenu } from "./header/MobileMenu";
import { BackupDialog } from "./header/BackupDialog";
import { StatisticsDialog } from "./header/StatisticsDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();
  
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile;
    }
  });

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://www.somfy.cz/common/img/library//logo_neva.png"
              alt="NEVA Logo"
              className="h-8"
            />
            <h1 className="text-xl font-bold text-[#212490] hidden md:block">
              ZÁVOZOVÝ SYSTÉM
            </h1>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <CustomerDialog />
            <BackupDialog />
            <StatisticsDialog />
            {currentUser?.role === 'Administrátor' && (
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => navigate('/users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Používatelia
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};