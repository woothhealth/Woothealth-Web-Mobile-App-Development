import { cookies } from "next/headers";

export async function GET() {
  const cookieHeader = cookies().toString();

  const res = await fetch("https://backend.woothealth.com/user.php", {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return new Response(null, { status: 401 });
  }

  return new Response(await res.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}