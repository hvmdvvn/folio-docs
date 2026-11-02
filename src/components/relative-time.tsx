"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function RelativeTime({
  value,
  prefix = "",
}: {
  value: string;
  prefix?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(
      formatDistanceToNow(new Date(value), {
        addSuffix: true,
      }),
    );
  }, [value]);

  if (!label) {
    return (
      <span suppressHydrationWarning>
        {prefix}just now
      </span>
    );
  }

  return (
    <span>
      {prefix}
      {label}
    </span>
  );
}
