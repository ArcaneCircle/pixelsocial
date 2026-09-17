import { useRef, useCallback } from "react";
import IconButton from "~/components/IconButton";

interface Props {
  accept: string;
  onFileSelected: (file: File) => void;
  children: React.ReactNode;
  [key: string]: any;
}

// Funcție ajutătoare pentru redimensionarea imaginii direct în browser
const resizeImage = (file: File, maxWidth = 1200): Promise<File> => {
  return new Promise((resolve) => {
    // Dacă fișierul nu este o imagine, nu facem resize
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Dacă imaginea este deja mai mică decât lățimea maximă, o lăsăm așa
        if (img.width <= maxWidth) {
          return resolve(file);
        }

        // Calculăm noile dimensiuni păstrând proporțiile (aspect ratio)
        const scaleFactor = maxWidth / img.width;
        const targetWidth = maxWidth;
        const targetHeight = img.height * scaleFactor;

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
          if (!blob) return resolve(file);
          // Recreăm obiectul File cu aceleași detalii, dar cu dimensiunea redusă
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, file.type);
      };
    };
  });
};

export default function FilePicker({
  children,
  accept,
  onFileSelected,
  ...props
}: Props) {
  const inputFile = useRef<HTMLInputElement | null>(null);

  const onChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const originalFile = event.target.files[0];
      
      // Aplicăm funcția de resize înainte de a trimite fișierul
      const fileToSend = await resizeImage(originalFile);
      
      onFileSelected(fileToSend);
      event.target.value = "";
    },
    [onFileSelected],
  );

  const onClick = useCallback(() => {
    inputFile.current?.click();
  }, [inputFile]);

  return (
    <IconButton onClick={onClick} {...props}>
      {children}
      <input
        type="file"
        accept={accept}
        multiple={false}
        onChange={onChange}
        ref={inputFile}
        style={{ display: "none" }}
      />
    </IconButton>
  );
}
