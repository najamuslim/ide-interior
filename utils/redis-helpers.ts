import redis from "./redis";

const GENERATED_IMAGE_PREFIX = "generated_image:";

export async function saveGeneratedImage(
  invoiceId: string,
  responseData: string
) {
  if (!redis) return;

  await redis.set(
    `${GENERATED_IMAGE_PREFIX}${invoiceId}`,
    responseData,
    // Set expiry to 30 days
    { ex: 60 * 60 * 24 * 30 }
  );
}

export async function getGeneratedImage(
  invoiceId: string
): Promise<string | null> {
  if (!redis) return null;

  const responseData = await redis.get(`${GENERATED_IMAGE_PREFIX}${invoiceId}`);
  return responseData as string | null;
}
