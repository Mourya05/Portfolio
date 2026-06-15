// Page transitions are disabled — the site is now a single-page scroll experience.
// This wrapper is kept as a pass-through to avoid breaking the layout contract.
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
