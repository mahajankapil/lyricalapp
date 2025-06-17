import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ExportVideoProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
}

export interface ExportOptions {
  filename: string;
  quality: 'low' | 'medium' | 'high';
  includeAudio: boolean;
  duration: number;
  currentTime?: number;
  capturedFrames?: Uint8Array[];
  frameRate?: number;
}

const ExportVideo = ({ onExport, isExporting }: ExportVideoProps) => {
  const [filename, setFilename] = useState('periodic_lyrics_video');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [duration, setDuration] = useState(10);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleExport = () => {
    if (!filename.trim()) {
      toast({
        title: "Filename required",
        description: "Please enter a filename for your export",
        variant: "destructive"
      });
      return;
    }
    
    onExport({
      filename,
      quality,
      includeAudio,
      duration
    });
    
    toast({
      title: "Export started",
      description: "Your video is being prepared for download"
    });
    
    // Close the dialog
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Periodic Lyrics Video</DialogTitle>
          <DialogDescription>
            Configure your video export settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quality" className="text-right">
              Quality
            </Label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="low">Low (480p)</option>
              <option value="medium">Medium (720p)</option>
              <option value="high">High (1080p)</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (s)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="includeAudio" className="text-right">
              Include Audio
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <input
                type="checkbox"
                id="includeAudio"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">Add audio track to the video</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportVideo;
