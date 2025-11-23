export function formatDateShort(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if the date is today
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  // Format options
  const optionsShort = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  const optionsMonthDay = {
    month: "short",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;
  const optionsFullDate = {
    month: "short",
    day: "numeric",
    year: "numeric",
  } as Intl.DateTimeFormatOptions;

  if (isToday) {
    return date.toLocaleTimeString([], optionsShort);
  } else if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], optionsMonthDay);
  } else {
    return date.toLocaleDateString([], optionsFullDate);
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024; // Define the base for conversion
  const dm = decimals < 0 ? 0 : decimals; // Ensure decimals is non-negative
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]; // Define size units

  const i = Math.floor(Math.log(bytes) / Math.log(k)); // Determine the index for the size unit
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]; // Format and return the result
}

export function getRandomUUID(): string {
  try {
    return crypto.randomUUID();
  } catch (ex) {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
}

export async function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  return new Promise((resolve, _reject) => {
    img.onload = async () => {
      resolve(img);
    };
  });
}

export function getImageExtension(dataUrl: string): string | null {
  const regex = /^data:image\/([a-zA-Z]+);base64/;
  const match = dataUrl.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null; // Return null if no valid image type is found
}
