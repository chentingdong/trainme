import React from 'react';

type Props = {
  data: unknown;
};

export default function Debug({ data }: Props) {
  const code = JSON.stringify(data, null, 2);
  return (
    <pre>{code || 'no data'}</pre>
  );
}