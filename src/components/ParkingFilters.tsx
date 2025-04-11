
import { useState, useEffect } from "react";
import { ParkingFilter } from "@/types/parking";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FilterIcon, Ban, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ParkingFiltersProps {
  filters: ParkingFilter;
  onFilterChange: (filters: ParkingFilter) => void;
  onResetFilters: () => void;
}

const ParkingFilters = ({ 
  filters, 
  onFilterChange, 
  onResetFilters 
}: ParkingFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ParkingFilter>(filters);

  // Update local filters when prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Handle filter change and apply
  const handleFilterChange = (key: keyof ParkingFilter, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Calculate if any filters are active
  const hasActiveFilters = 
    filters.maxPrice !== null || 
    filters.minTimeLimit !== null || 
    filters.maxDistance !== null || 
    filters.showOnlyAvailable ||
    !filters.includePredicted;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Find Parking</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResetFilters}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Reset</span>
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`gap-1 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
            >
              <FilterIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Filters</span>
              {hasActiveFilters && <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">!</span>}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-4 bg-muted/50 p-4 rounded-lg">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="maxPrice">Maximum Price ($/hr)</Label>
            <span className="text-sm font-medium">
              {localFilters.maxPrice === null ? 'Any' : `$${localFilters.maxPrice}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={localFilters.maxPrice === null ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => handleFilterChange('maxPrice', null)}
            >
              Any
            </Button>
            <Slider
              id="maxPrice"
              defaultValue={[localFilters.maxPrice ?? 20]}
              max={20}
              step={1}
              onValueChange={(value) => handleFilterChange('maxPrice', value[0])}
              disabled={localFilters.maxPrice === null}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="maxDistance">Maximum Distance (km)</Label>
            <span className="text-sm font-medium">
              {localFilters.maxDistance === null ? 'Any' : `${localFilters.maxDistance}km`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={localFilters.maxDistance === null ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => handleFilterChange('maxDistance', null)}
            >
              Any
            </Button>
            <Slider
              id="maxDistance"
              defaultValue={[localFilters.maxDistance ?? 2]}
              max={5}
              step={0.1}
              onValueChange={(value) => handleFilterChange('maxDistance', value[0])}
              disabled={localFilters.maxDistance === null}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="minTimeLimit">Minimum Time Limit (min)</Label>
            <span className="text-sm font-medium">
              {localFilters.minTimeLimit === null ? 'Any' : `${localFilters.minTimeLimit}min`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={localFilters.minTimeLimit === null ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => handleFilterChange('minTimeLimit', null)}
            >
              Any
            </Button>
            <Slider
              id="minTimeLimit"
              defaultValue={[localFilters.minTimeLimit ?? 60]}
              max={120}
              step={15}
              onValueChange={(value) => handleFilterChange('minTimeLimit', value[0])}
              disabled={localFilters.minTimeLimit === null}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showOnlyAvailable" 
              checked={localFilters.showOnlyAvailable}
              onCheckedChange={(checked) => 
                handleFilterChange('showOnlyAvailable', checked === true)
              }
            />
            <Label htmlFor="showOnlyAvailable">
              Only Available Now
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includePredicted" 
              checked={localFilters.includePredicted}
              onCheckedChange={(checked) => 
                handleFilterChange('includePredicted', checked === true)
              }
            />
            <Label htmlFor="includePredicted">
              Include Soon Available
            </Label>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ParkingFilters;
