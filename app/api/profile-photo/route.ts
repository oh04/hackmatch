import { getStore } from "@netlify/blobs";
import { getUser, verifyRequestOrigin } from "@netlify/identity";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxPhotoSize = 4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    verifyRequestOrigin(request);
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Sign in before uploading a photo." }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo");
    if (!(photo instanceof File)) {
      return Response.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    if (!allowedImageTypes.has(photo.type)) {
      return Response.json({ error: "Choose a JPG, PNG, or WebP image." }, { status: 400 });
    }
    if (photo.size > maxPhotoSize) {
      return Response.json({ error: "Choose an image smaller than 4 MB." }, { status: 400 });
    }

    const photos = getStore("profile-photos");
    await photos.set(user.id, photo, {
      metadata: {
        contentType: photo.type,
        ownerId: user.id,
        updatedAt: new Date().toISOString(),
      },
    });

    return Response.json({
      url: `/api/profile-photo/${encodeURIComponent(user.id)}?v=${Date.now()}`,
    });
  } catch {
    return Response.json(
      { error: "The photo upload failed. Try again in a moment." },
      { status: 500 },
    );
  }
}
