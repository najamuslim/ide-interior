export default function appendNewToName(name: string | null) {
  if (!name) return "generated-room.jpg";

  const insertPos = name.indexOf(".");
  if (insertPos === -1) return `${name}-generated`;

  return name.substring(0, insertPos).concat("-new", name.substring(insertPos));
}
