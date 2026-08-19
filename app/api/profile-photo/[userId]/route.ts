import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(userId)) {
    return new Response("Not found", { status: 404 });
  }

  const photos = getStore("profile-photos");
  const entry = await photos.getWithMetadata(userId, {
    type: "arrayBuffer",
    consistency: "strong",
  });
  if (!entry) return new Response("Not found", { status: 404 });

  const contentType =
    typeof entry.metadata?.contentType === "string"
      ? entry.metadata.contentType
      : "image/jpeg";

  return new Response(entry.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
