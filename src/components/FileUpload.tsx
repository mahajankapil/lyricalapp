
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelected: (file: File, url: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

const FileUpload = ({ 
  onFileSelected, 
  acceptedTypes = "audio/*", 
  maxSize = 10
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.match(acceptedTypes.replace(/\*/g, '.*'))) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with type: ${acceptedTypes}`,
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

    // Create URL for audio element
    const url = URL.createObjectURL(file);
    onFileSelected(file, url);
    
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Audio</CardTitle>
        <CardDescription>
          Upload an MP3 or other audio file to sync with lyrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl">🎵</div>
            <p className="text-sm text-muted-foreground">
              Drag and drop your audio file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP3, WAV, OGG (Max {maxSize}MB)
            </p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept={acceptedTypes}
                onChange={handleFileChange}
              />
              <Button variant="outline" size="sm" type="button">
                Browse Files
              </Button>
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your files stay on your device - we don't upload them anywhere.
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
