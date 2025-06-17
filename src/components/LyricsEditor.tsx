import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface LyricsEditorProps {
  lyrics: string;
  onSave: (lyrics: string) => void;
}

export const LyricsEditor: React.FC<LyricsEditorProps> = ({ lyrics, onSave }) => {
  const [editedLyrics, setEditedLyrics] = React.useState(lyrics);

  React.useEffect(() => {
    setEditedLyrics(lyrics);
  }, [lyrics]);

  const handleSave = () => {
    onSave(editedLyrics);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <Textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            className="min-h-[200px] font-mono"
            placeholder="Enter your lyrics here..."
          />
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 