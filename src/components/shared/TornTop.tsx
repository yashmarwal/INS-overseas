// A hand-torn edge at the TOP of a section: the previous section's colour hangs down into this one with a ragged lower
// edge, like the deckle of handmade paper. The parent section needs `relative`; pass the previous section's colour.
export default function TornTop({ color }: { color: string }) {
  return <div aria-hidden className="absolute left-0 right-0 -top-px h-6 z-[1] pointer-events-none torn-edge-bottom" style={{ background: color }} />;
}
