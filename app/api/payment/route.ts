import { NextResponse } from "next/server";
interface PaymentData {
  name: string;
  email: string;
  amount: string;
  orderID: string;
  type: string;
}
function getPayPalApiUrl() {
  const isDev = process.env.NODE_ENV === "development";
  return isDev
    ? process.env.PAYPAL_API_URL_DEVELOPMENT
    : process.env.PAYPAL_API_URL_PRODUCTION;
}

const PAYPAL_API_URL = getPayPalApiUrl();

async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw error;
  }
}
async function capturePayPalOrder(orderID: string, accessToken: string) {
  try {
    console.log(
      `Capturing order ${orderID} with token ${accessToken.substring(0, 10)}...`
    );

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    const data = await response.json();
    console.log("Capture response:", data);
    return data;
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    throw error;
  }
}
export async function POST(req: Request) {
  const body = await req.json();
  const { type, name, email, amount, orderID } = body;

  const PAYPAL_API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.PAYPAL_API_URL_DEVELOPMENT
      : process.env.PAYPAL_API_URL_PRODUCTION;

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  // Helper to get access token
  const getAccessToken = async () => {
    const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const data = await res.json();
    return data.access_token;
  };

  try {
    const accessToken = await getAccessToken();

    if (type === "create") {
      // Create order
      const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{ amount: { currency_code: "EUR", value: amount } }],
        }),
      });

      const data = await res.json();
      return NextResponse.json({ orderID: data.id });
    } else if (type === "capture") {
      // Capture order
      const res = await fetch(
        `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.status !== "COMPLETED") {
        return NextResponse.json(
          { error: "Payment capture failed", status: data.status },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, captureData: data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Payment API endpoint" },
    { status: 200 }
  );
}
