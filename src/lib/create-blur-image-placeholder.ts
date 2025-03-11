import sharp from "sharp";

export async function createBlurImagePlaceholder(
  image: File
): Promise<{ base64DataUrl: string; aspectRatio: string }> {
  const imageArrayBuffer = await image.arrayBuffer();
  const imageBuffer = Buffer.from(imageArrayBuffer);
  const buffer = await sharp(imageBuffer)
    .resize({ width: 200 })
    .blur(20)
    .jpeg({ quality: 30 })
    .toBuffer();
  const { height, width } = await sharp(imageBuffer).metadata();
  console.log(height, width);
  const base64 = buffer.toString("base64");

  return {
    base64DataUrl: `data:${image.type};base64,${base64}`,
    aspectRatio: `${width}/${height}`,
  };
}
