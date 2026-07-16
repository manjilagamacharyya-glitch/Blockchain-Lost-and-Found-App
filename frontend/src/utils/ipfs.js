import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
});

export async function uploadImageToIPFS(file) {
  const upload = await pinata.upload.public.file(file);
  return upload.cid;
}