import { z } from "zod";
import { authenticate, createSession } from "@/lib/auth";
import { jsonError, jsonOk, HttpError } from "@/lib/http";

const bodySchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const user = await authenticate(body.email, body.password);
    if (!user) {
      throw new HttpError("Those credentials did not match a seeded account", 401);
    }
    await createSession(user);
    return jsonOk({ user });
  } catch (error) {
    return jsonError(error);
  }
}
