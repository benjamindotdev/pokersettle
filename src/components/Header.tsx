export function Header() {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        <span className="text-primary">♠</span> Poker Settler
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Calculate the simplest way to settle poker winnings.
      </p>
    </header>
  );
}
