import * as React from "react"
import { cn } from "@/lib/utils"

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onFileChange?: (files: FileList | null) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileChange, ...props }, ref) => {
    const [fileName, setFileName] = React.useState<string>('No file chosen');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setFileName(files.length > 1 ? `${files.length} files selected` : files[0].name);
      } else {
        setFileName('No file chosen');
      }
      if (onFileChange) {
        onFileChange(files);
      }
    };

    return (
      <div className="relative">
        <input
          type="file"
          className="sr-only"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <label
          htmlFor={props.id || 'file-upload'}
          className={cn(
            "flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-md cursor-pointer",
            "hover:bg-zinc-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-600 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900",
            className
          )}
        >
          <span className="truncate">{fileName}</span>
          <span className="px-3 py-1 text-xs bg-zinc-700 rounded-md">Browse</span>
        </label>
      </div>
    )
  }
)

FileInput.displayName = "FileInput"

export { FileInput }