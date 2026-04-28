export function Header() {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-primary">♠</span> Poker Settler
      </h1>
      <p className="text-muted-foreground">
        Calculate the simplest way to settle poker winnings.
      </p>
    </header>
  );
}
