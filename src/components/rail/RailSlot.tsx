/** Empty media frame — layout placeholder, no asset. */
export default function RailSlot({
  className = "",
  ratio,
}: {
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`ag-slot ${className}`.trim()}
      style={ratio ? { aspectRatio: ratio } : undefined}
      aria-hidden
    />
  );
}
