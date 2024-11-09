import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const externalId = searchParams.get('id');

  if (!externalId) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  try {
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
      const invoice = data[0];
      return NextResponse.json(invoice);
    }
    
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  } catch (error) {
    console.error('Error checking invoice:', error);
    return NextResponse.json({ error: "Failed to check invoice" }, { status: 500 });
  }
}