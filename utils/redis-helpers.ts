import redis from "./redis";

export const markInvoiceAsUsed = async (invoiceId: string) => {
  if (!redis) return false;
  return await redis.set(`invoice:${invoiceId}`, "used", { ex: 60 * 60 * 24 * 7 }); // Expire after 7 days
};

export const checkInvoiceUsage = async (invoiceId: string) => {
  if (!redis) return false;
  const status = await redis.get(`invoice:${invoiceId}`);
  return status === "used";
};

const GENERATED_IMAGE_PREFIX = 'generated_image:';

export async function saveGeneratedImage(invoiceId: string, responseData: string) {
  if (!redis) return;
  
  await redis.set(
    `${GENERATED_IMAGE_PREFIX}${invoiceId}`,
    responseData,
    // Set expiry to 30 days
    { ex: 60 * 60 * 24 * 30 }
  );
}

export async function getGeneratedImage(invoiceId: string): Promise<string | null> {
  if (!redis) return null;
  
  const responseData = await redis.get(`${GENERATED_IMAGE_PREFIX}${invoiceId}`);
  return responseData as string | null;
} 