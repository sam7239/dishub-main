interface OnlineIndicatorProps {
  className?: string;
}

export function OnlineIndicator({ className = "" }: OnlineIndicatorProps) {
  return (
    <div
      className={`h-2.5 w-2.5 rounded-full bg-green-500 ${className}`}
      style={{ boxShadow: "0 0 0 2px white" }}
    />
  );
}
