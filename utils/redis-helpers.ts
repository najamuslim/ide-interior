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