import { useRef, useCallback } from "react";

import IconButton from "~/components/IconButton";

interface Props {
  accept: string;
  onFileSelected: (file: File) => void;
  children: React.ReactNode;
  [key: string]: any;
}

export default function FilePicker({
  children,
  accept,
  onFileSelected,
  ...props
}: Props) {
  const inputFile = useRef<HTMLInputElement | null>(null);

  const onChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      onFileSelected(event.target.files[0]);
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
