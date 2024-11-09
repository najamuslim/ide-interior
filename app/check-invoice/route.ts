import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      // 30 requests per minute per IP
      // Lebih longgar dari create invoice karena ini endpoint yang dipoll
      limiter: Ratelimit.fixedWindow(30, "60 s"),
      analytics: true,
    })
  : undefined;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const externalId = searchParams.get('id');

  if (!externalId) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  try {
    //Rate Limiter Code
    if (ratelimit) {
      const headersList = headers();
      const ipIdentifier = headersList.get("x-real-ip");

      const result = await ratelimit.limit(ipIdentifier ?? "");

      if (!result.success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const invoice = await getInvoiceData(externalId);
    
    if (invoice.status !== 'PAID' || !invoice.metadata) {
      return NextResponse.json(invoice);
    }

    // Return invoice data with metadata
    return NextResponse.json({
      status: invoice.status,
      metadata: invoice.metadata,
      loading: true
    });
    
  } catch (error) {
    console.error('Error checking invoice:', error);
    return NextResponse.json({ error: "Failed to check invoice" }, { status: 500 });
  }
}

async function getInvoiceData(externalId: string) {
  const base64Credentials = Buffer.from(`${process.env.XENDIT_API_KEY}:`).toString('base64');
  
  const response = await fetch(`https://api.xendit.co/v2/invoices?external_id=${externalId}`, {
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error('Failed to fetch invoice');
  }
  
  if (data && data.length > 0) {
    return data[0];
  }
  
  throw new Error('Invoice not found');
}