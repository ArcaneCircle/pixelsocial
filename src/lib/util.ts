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
  if (/^https?:\/\//.test(url)) {
    img.crossOrigin = "anonymous";
  }

  return new Promise((resolve, reject) => {
    img.onload = async () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

type ResizeImageSource = File | Blob | string;
type ResizeImageOutput = "dataUrl" | "blob";

interface ResizeImageOptions {
  width: number;
  height: number;
  keepAspectRatio?: boolean;
  allowUpscale?: boolean;
  mimeType?: string;
  quality?: number;
  output?: ResizeImageOutput;
}

export async function resizeImage(
  source: ResizeImageSource,
  options: ResizeImageOptions & { output: "blob" },
): Promise<Blob>;
export async function resizeImage(
  source: ResizeImageSource,
  options: ResizeImageOptions & { output?: "dataUrl" },
): Promise<string>;
export async function resizeImage(
  source: ResizeImageSource,
  {
    width,
    height,
    keepAspectRatio = true,
    allowUpscale = false,
    mimeType = "image/jpeg",
    quality = 0.9,
    output = "dataUrl",
  }: ResizeImageOptions,
): Promise<string | Blob> {
  if (width <= 0 || height <= 0) {
    throw new Error("Target image size must be greater than 0");
  }

  const url = typeof source === "string" ? source : URL.createObjectURL(source);

  try {
    const img = await loadImage(url);
    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;

    const target = getResizeTarget(
      sourceWidth,
      sourceHeight,
      width,
      height,
      keepAspectRatio,
      allowUpscale,
    );
    const canvas = drawImageAtSize(
      img,
      sourceWidth,
      sourceHeight,
      target.width,
      target.height,
    );

    if (output === "blob") {
      return canvasToBlob(canvas, mimeType, quality);
    }

    return canvas.toDataURL(mimeType, quality);
  } finally {
    if (typeof source !== "string") {
      URL.revokeObjectURL(url);
    }
  }
}

function getResizeTarget(
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
  keepAspectRatio: boolean,
  allowUpscale: boolean,
) {
  if (!keepAspectRatio) {
    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const safeScale = allowUpscale ? scale : Math.min(scale, 1);

  return {
    width: Math.max(1, Math.round(sourceWidth * safeScale)),
    height: Math.max(1, Math.round(sourceHeight * safeScale)),
  };
}

function drawImageAtSize(
  img: HTMLImageElement,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  let currentSource: CanvasImageSource = img;
  let currentWidth = sourceWidth;
  let currentHeight = sourceHeight;

  while (
    Math.max(currentWidth / targetWidth, currentHeight / targetHeight) > 2
  ) {
    const nextWidth = Math.max(targetWidth, Math.round(currentWidth / 2));
    const nextHeight = Math.max(targetHeight, Math.round(currentHeight / 2));
    const nextCanvas = document.createElement("canvas");
    const nextContext = nextCanvas.getContext("2d")!;

    nextCanvas.width = nextWidth;
    nextCanvas.height = nextHeight;
    nextContext.imageSmoothingEnabled = true;
    nextContext.imageSmoothingQuality = "high";
    nextContext.drawImage(
      currentSource,
      0,
      0,
      currentWidth,
      currentHeight,
      0,
      0,
      nextWidth,
      nextHeight,
    );

    currentSource = nextCanvas;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    currentSource,
    0,
    0,
    currentWidth,
    currentHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create resized image"));
        }
      },
      mimeType,
      quality,
    );
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
