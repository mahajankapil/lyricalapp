import { ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AddMp3ButtonProps {
  onFileSelected: (file: File, url: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

export const AddMp3Button = ({
  onFileSelected,
  acceptedTypes = ".mp3", // Default to MP3
  maxSize = 10,
}: AddMp3ButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match(/^audio\/mp(3|e?g)$/i) && !file.type.match(/^audio\/wav$/i) && !file.type.match(/^audio\/ogg$/i)) {
        toast({
          title: "Invalid file type",
          description: `Please upload an MP3, WAV, or OGG audio file.`,
          variant: "destructive",
        });
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxSize}MB`,
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(file);
      onFileSelected(file, url);
      
      toast({
        title: "Audio file loaded",
        description: `${file.name} has been loaded successfully.`,
      });

      // Clear the file input after selection to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <> {/* Using a fragment because a direct button might be used in flex layout */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />
      <Button onClick={handleClick} variant="outline">
        Add MP3 File
      </Button>
    </>
  );
}; 