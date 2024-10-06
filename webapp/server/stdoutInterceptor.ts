export const interceptStdout = () => {
  const originalWrite = process.stdout.write.bind(process.stdout);

  process.stdout.write = ((chunk: string, encoding: BufferEncoding, callback?: (err?: Error) => void) => {
    let decodedChunk = chunk.toString();
    try {
      decodedChunk = decodeURIComponent(decodedChunk);
    } catch (e) {
      // Ignore if the log is not URL-encoded
      console.error('Error decoding log:', e);
    }
    return originalWrite(decodedChunk, encoding, callback);
  }) as typeof process.stdout.write;
};
