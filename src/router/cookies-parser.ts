// Cookies parser
// TODO: Ver esto más en detalle en criptografia (HMAC)
import { createHmac, timingSafeEqual } from "crypto";
import { ParseOptions } from "./types/ParseOptions.js";
import { RequestFull } from "./types/RequestFull.js";

export const autoCookieParser = (request: RequestFull) => {
  const cookies = request.headers.get("Cookie") || "";

  const ck = cookiesParser(cookies);
  request.cookies = ck;
};

export const cookiesParser = (cookie: string, options?: ParseOptions) => {
  const decode = options?.decode ?? decodeURIComponent;
  const cookies: Record<string, string> = Object.create(null);

  for (const pair of cookie.split(";")) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx < 0) continue;

    const key = pair.substring(0, eqIdx).trim();
    if (!key) continue;

    let val = pair.substring(eqIdx + 1).trim();
    if (val.charCodeAt(0) === 0x22 /* " */) {
      val = val.slice(1, -1);
    }

    if (cookies[key] === undefined) {
      try {
        cookies[key] = decode(val);
      } catch {
        cookies[key] = val;
      }
    }
  }

  const secrets = !options?.secrets
    ? []
    : Array.isArray(options.secrets)
      ? options.secrets
      : [options.secrets];

  const result: Record<string, unknown> = Object.create(null);

  for (const key of Object.keys(cookies)) {
    result[key] = resolveValue(cookies[key], secrets);
  }

  return result;
};

const resolveValue = (raw: string, secrets: string[]): unknown => {
  if (raw.substring(0, 2) === "s:" && secrets.length > 0) {
    const unsigned = tryUnsign(raw.slice(2), secrets);
    if (unsigned === false) return false;
    return tryJSON(unsigned) ?? unsigned;
  }

  return tryJSON(raw) ?? raw;
};

const tryJSON = (str: string): unknown | undefined => {
  if (str.substring(0, 2) !== "j:") return undefined;

  try {
    return JSON.parse(str.slice(2));
  } catch {
    return undefined;
  }
};

const tryUnsign = (payload: string, secrets: string[]): string | false => {
  const dotIdx = payload.lastIndexOf(".");
  if (dotIdx < 0) return false;

  const value = payload.substring(0, dotIdx);
  const providedSig = payload.substring(dotIdx + 1);

  for (const secret of secrets) {
    const expectedSig = createHmac("sha256", secret)
      .update(value)
      .digest("base64")
      .replace(/=+$/, "");

    const a = Buffer.from(providedSig);
    const b = Buffer.from(expectedSig);

    if (a.length === b.length && timingSafeEqual(a, b)) {
      return value;
    }
  }

  return false;
};
