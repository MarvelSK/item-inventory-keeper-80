export const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NEVA SK s.r.o. Všetky práva vyhradené.
        </p>
      </div>
    </footer>
  );
};