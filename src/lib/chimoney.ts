const baseUrl = "https://api-v2-sandbox.chimoney.io/v0.2";
const prodUrl = "https://api.chimoney.io/v0.2";
const apiKey = process.env.NEXT_PUBLIC_CHIMONEY_API_KEY as string;

export async function chi(
  url: string,
  { body, isProd = false, ...options }: any
) {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "X-API-KEY": apiKey,
  };

  const config = {
    method: options.method || body ? "POST" : "GET",
    ...options,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch((isProd ? prodUrl : baseUrl) + url, config);
  return await res.json();
}
