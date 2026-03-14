const getNormalizedType = (attachment) => attachment?.type?.toLowerCase().trim() || "";

const getNormalizedName = (attachment) => attachment?.name?.toLowerCase().trim() || "";

const dataUrlToBlob = (dataUrl) => {
  const [metadata, content] = dataUrl.split(",");

  if (!metadata || !content) {
    throw new Error("Invalid attachment data");
  }

  const mimeMatch = metadata.match(/data:(.*?)(;base64)?$/i);
  const mimeType = mimeMatch?.[1] || "application/octet-stream";
  const isBase64 = metadata.includes(";base64");

  if (!isBase64) {
    return new Blob([decodeURIComponent(content)], { type: mimeType });
  }

  const binary = window.atob(content);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
};

export const isImageAttachment = (attachment) => {
  const type = getNormalizedType(attachment);
  const name = getNormalizedName(attachment);
  const dataUrl = attachment?.dataUrl || "";

  return (
    type.startsWith("image/") ||
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".gif") ||
    name.endsWith(".webp") ||
    dataUrl.startsWith("data:image/")
  );
};

export const isPdfAttachment = (attachment) => {
  const type = getNormalizedType(attachment);
  const name = getNormalizedName(attachment);
  const dataUrl = attachment?.dataUrl || "";

  return (
    type === "application/pdf" ||
    name.endsWith(".pdf") ||
    dataUrl.startsWith("data:application/pdf")
  );
};

export const canOpenAttachment = (attachment) => Boolean(attachment?.dataUrl);

export const openAttachment = (attachment) => {
  if (!canOpenAttachment(attachment)) {
    return false;
  }

  try {
    const blob = dataUrlToBlob(attachment.dataUrl);
    const objectUrl = window.URL.createObjectURL(blob);
    const previewWindow = window.open(objectUrl, "_blank");

    if (previewWindow) {
      previewWindow.opener = null;
    } else {
      const link = document.createElement("a");
      link.href = objectUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    window.setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 300_000);

    return true;
  } catch (error) {
    return false;
  }
};
