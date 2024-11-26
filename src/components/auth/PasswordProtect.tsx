import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const PasswordProtect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src="https://www.somfy.cz/common/img/library//logo_neva.png"
            alt="NEVA Logo"
            className="h-16 mb-6"
          />
          <h2 className="text-2xl font-bold text-[#212490]">
            Prihláste sa do systému
          </h2>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#212490',
                  brandAccent: '#47acc9',
                }
              }
            }
          }}
          providers={[]}
          view="sign_in"
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Heslo",
                button_label: "Prihlásiť sa",
                loading_button_label: "Prihlasovanie...",
                password_input_placeholder: "Vaše heslo",
                email_input_placeholder: "Váš email",
              },
              forgotten_password: {
                email_label: "Email",
                button_label: "Poslať inštrukcie na reset hesla",
                loading_button_label: "Posielanie inštrukcií...",
                email_input_placeholder: "Váš email",
                confirmation_text: "Skontrolujte svoj email pre inštrukcie na reset hesla",
                link_text: "Späť na prihlásenie",
              },
            },
          }}
        />
      </div>
    </div>
  );
};