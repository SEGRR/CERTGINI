export function arrayBufferToBlob(arrayBuffer, contentType) {
    const buffer = Buffer.from(arrayBuffer);
    return new Blob([buffer], { type: contentType });
  }