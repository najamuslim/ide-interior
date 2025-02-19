export default function appendNewToName(name: string | null) {
  if (!name) return "generated-room.jpg";

  // Normalize the filename first
  const normalizedName = name.toLowerCase();

  // Get file extension
  const extensions = [".jpg", ".jpeg", ".png", ".webp"];
  let fileExtension =
    extensions.find((ext) => normalizedName.endsWith(ext)) || ".jpg";

  // Remove any existing extensions from the name
  const baseName = name.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  // Return formatted filename
  return `${baseName}-new${fileExtension}`;
}
