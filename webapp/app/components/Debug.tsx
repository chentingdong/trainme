import React from "react";

type Props = {
  data: unknown;
};

export default function Debug({ data }: Props) {
  const code = JSON.stringify(data, null, 2);
  return <pre className="whitespace-pre-wrap text-gray-400 opacity-30">{code || "no data"}</pre>;
}
