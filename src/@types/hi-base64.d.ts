declare module "hi-base64" {
  function encode(data: string | Uint8Array): string;
  const decode: {
    (base64String: string): string;
    bytes: (base64String: string) => Uint8Array;
  };

}