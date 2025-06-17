import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ElementProps {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicWeight: string;
  category?: string;
  active?: boolean;
  word?: string;
  className?: string;
}

export const ElementTile = ({
  symbol,
  name,
  atomicNumber,
  atomicWeight,
  category = "nonmetal",
  active = false,
  word,
  className,
}: ElementProps) => {
  const [hover, setHover] = useState(false);
  
  const getCategoryColor = () => {
    switch (category) {
      case "alkali": return "bg-chemistry-element-alkali";
      case "alkaline": return "bg-chemistry-element-alkaline";
      case "transition": return "bg-chemistry-element-transition";
      case "post": return "bg-chemistry-element-post";
      case "metalloid": return "bg-chemistry-element-metalloid";
      case "nonmetal": return "bg-chemistry-element-nonmetal";
      case "noble": return "bg-chemistry-element-noble";
      case "lanthanide": return "bg-chemistry-element-lanthanide";
      case "actinide": return "bg-chemistry-element-actinide";
      default: return "bg-chemistry-element-nonmetal";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'element-tile',
              getCategoryColor(),
              active && 'active-lyric animate-pulsate',
              className
            )}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <span className="atomic-number">{atomicNumber}</span>
            <div className="flex flex-col items-center justify-center flex-grow w-full">
              <span className="element-symbol">{symbol}</span>
              <div className="element-name">{name}</div>
            </div>
            {atomicWeight !== 'N/A' && <span className="element-weight">{atomicWeight}</span>}
          </div>
        </TooltipTrigger>
        {word && (
          <TooltipContent>
            <p>{word}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
