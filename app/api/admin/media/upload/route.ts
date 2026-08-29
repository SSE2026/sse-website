import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getApiBaseUrl, API_PREFIX } from "@/lib/api/config";

// POST /api/admin/media/upload - Generic media upload (admin) → Cloudinary
export async function POST(request: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const folder = formData.get("folder") || "products";

    // Basic client-side type guard (server does the real validation)
    const allowedImage = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideo = ["video/mp4", "video/webm"];
    if (![...allowedImage, ...allowedVideo].includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPG, PNG, WebP, MP4, WebM" },
        { status: 400 },
      );
    }

    const maxImage = 10 * 1024 * 1024;
    const maxVideo = 100 * 1024 * 1024;
    const max = allowedImage.includes(file.type) ? maxImage : maxVideo;
    if (file.size > max) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum ${Math.round(max / 1024 / 1024)}MB` },
        { status: 400 },
      );
    }

    const backendForm = new FormData();
    backendForm.append("file", file);

    const response = await fetch(
      `${baseUrl}${API_PREFIX}/admin/media/upload?folder=${folder}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: backendForm,
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: (data as { message?: string }).message || `Upload failed (${response.status})`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Media upload proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
