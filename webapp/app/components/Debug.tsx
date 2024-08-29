"use client";

import React from 'react';

type Props = {
  data: unknown;
};

export default function Debug({ data }: Props) {
  const [code, setCode] = React.useState<string>('');
  React.useEffect(() => {
    setCode(JSON.stringify(data, null, 2));
  }, [data]);

  return (
    <pre>{code}</pre>
  );
}