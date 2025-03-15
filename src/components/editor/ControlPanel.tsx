import React from 'react';
import { ControlPanelProps } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ControlSection from './ControlSection';
import ColorPicker from './ColorPicker';
import ResetButton from './ResetButton';

const ControlPanel = ({ 
  styles, 
  onChange,
  onReset,
  hasChanges = false
}: ControlPanelProps) => {
  const updateStyle = React.useCallback(<K extends keyof typeof styles>(key: K, value: typeof styles[K]) => {
    onChange({ ...styles, [key]: value });
  }, [onChange, styles]);

  // Helper function for slider with numeric input
  const SliderWithInput = React.useCallback(({ 
    value, 
    onChange,
    min, 
    max, 
    step = 1,
    label,
    unit = 'px'
  }: {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    label: string;
    unit?: string;
  }) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`} className="text-xs font-medium">
            {label}
          </Label>
          <div className="flex items-center gap-1">
            <Input
              id={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
              type="number"
              value={localValue}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setLocalValue(newValue);
                onChange(newValue);
              }}
              min={min}
              max={max}
              step={step}
              className="h-6 w-16 text-xs px-2"
            />
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>
        <Slider
          id={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
          value={[localValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={(values) => {
            setLocalValue(values[0]);
            onChange(values[0]);
          }}
          className="py-1"
        />
      </div>
    );
  }, []);

  return (
    <div className="h-full overflow-y-auto pb-4 scrollbar-hide">
      <div className="sticky top-0 z-10 pb-2 mb-2 bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Button Editor</h2>
          {hasChanges && <ResetButton onReset={onReset} label="Reset button styles" />}
        </div>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-0 animate-in">
          <ControlSection title="Colors" expanded>
            <ColorPicker 
              color={styles.backgroundColor} 
              onChange={(color) => updateStyle('backgroundColor', color)} 
              label="Background Color" 
            />
            <ColorPicker 
              color={styles.textColor} 
              onChange={(color) => updateStyle('textColor', color)} 
              label="Text Color" 
            />
            <ColorPicker 
              color={styles.borderColor} 
              onChange={(color) => updateStyle('borderColor', color)} 
              label="Border Color" 
            />
          </ControlSection>
          
          <ControlSection title="Dimensions">
            <SliderWithInput 
              value={styles.paddingX} 
              onChange={(value) => updateStyle('paddingX', value)} 
              min={0} 
              max={40} 
              label="Padding X" 
            />
            <SliderWithInput 
              value={styles.paddingY} 
              onChange={(value) => updateStyle('paddingY', value)} 
              min={0} 
              max={40} 
              label="Padding Y" 
            />
            <SliderWithInput 
              value={styles.borderWidth} 
              onChange={(value) => updateStyle('borderWidth', value)} 
              min={0} 
              max={8} 
              label="Border Width" 
            />
            <SliderWithInput 
              value={styles.borderRadius} 
              onChange={(value) => updateStyle('borderRadius', value)} 
              min={0} 
              max={30} 
              label="Border Radius" 
            />
          </ControlSection>
          
          <ControlSection title="Shadow">
            <SliderWithInput 
              value={styles.shadowOpacity} 
              onChange={(value) => updateStyle('shadowOpacity', value)} 
              min={0} 
              max={1} 
              step={0.01} 
              label="Shadow Opacity" 
              unit=""
            />
            {styles.shadowOpacity > 0 && (
              <>
                <ColorPicker 
                  color={styles.shadowColor} 
                  onChange={(color) => updateStyle('shadowColor', color)} 
                  label="Shadow Color" 
                />
                <SliderWithInput 
                  value={styles.shadowOffsetX} 
                  onChange={(value) => updateStyle('shadowOffsetX', value)} 
                  min={-20} 
                  max={20} 
                  label="Shadow X Offset" 
                />
                <SliderWithInput 
                  value={styles.shadowOffsetY} 
                  onChange={(value) => updateStyle('shadowOffsetY', value)} 
                  min={-20} 
                  max={20} 
                  label="Shadow Y Offset" 
                />
                <SliderWithInput 
                  value={styles.shadowBlur} 
                  onChange={(value) => updateStyle('shadowBlur', value)} 
                  min={0} 
                  max={40} 
                  label="Shadow Blur" 
                />
                <SliderWithInput 
                  value={styles.shadowSpread} 
                  onChange={(value) => updateStyle('shadowSpread', value)} 
                  min={0} 
                  max={40} 
                  label="Shadow Spread" 
                />
              </>
            )}
          </ControlSection>
          
          <ControlSection title="Animation">
            <SliderWithInput 
              value={styles.transitionDuration} 
              onChange={(value) => updateStyle('transitionDuration', value)} 
              min={0} 
              max={1000} 
              step={10} 
              label="Transition Duration" 
              unit="ms"
            />
            <div className="mb-3">
              <Label htmlFor="transition-easing" className="text-xs mb-1.5 block">Transition Easing</Label>
              <Select 
                value={styles.transitionEasing} 
                onValueChange={(value) => updateStyle('transitionEasing', value)}
              >
                <SelectTrigger id="transition-easing" className="h-9">
                  <SelectValue placeholder="Select easing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ease">Ease</SelectItem>
                  <SelectItem value="ease-in">Ease In</SelectItem>
                  <SelectItem value="ease-out">Ease Out</SelectItem>
                  <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                  <SelectItem value="linear">Linear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </ControlSection>
        </TabsContent>
        
        <TabsContent value="states" className="mt-0 animate-in">
          <ControlSection title="Hover State" expanded>
            <ColorPicker 
              color={styles.hoverBackgroundColor} 
              onChange={(color) => updateStyle('hoverBackgroundColor', color)} 
              label="Hover Background" 
            />
            <SliderWithInput 
              value={styles.hoverBackgroundOpacity ?? 90} 
              onChange={(value) => updateStyle('hoverBackgroundOpacity', value)} 
              min={0} 
              max={100} 
              step={5} 
              label="Hover Background Opacity" 
              unit="%"
            />
            <ColorPicker 
              color={styles.hoverTextColor} 
              onChange={(color) => updateStyle('hoverTextColor', color)} 
              label="Hover Text" 
            />
            <ColorPicker 
              color={styles.hoverBorderColor} 
              onChange={(color) => updateStyle('hoverBorderColor', color)} 
              label="Hover Border" 
            />
          </ControlSection>
        </TabsContent>
        
        <TabsContent value="typography" className="mt-0 animate-in">
          <ControlSection title="Text Properties" expanded>
            <SliderWithInput 
              value={styles.fontSize} 
              onChange={(value) => updateStyle('fontSize', value)} 
              min={8} 
              max={24} 
              label="Font Size" 
            />
            
            <div className="mb-3">
              <Label htmlFor="font-weight" className="text-xs mb-1.5 block">Font Weight</Label>
              <Select 
                value={styles.fontWeight} 
                onValueChange={(value) => updateStyle('fontWeight', value)}
              >
                <SelectTrigger id="font-weight" className="h-9">
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Regular (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-3">
              <Label htmlFor="text-transform" className="text-xs mb-1.5 block">Text Transform</Label>
              <Select 
                value={styles.textTransform} 
                onValueChange={(value) => updateStyle('textTransform', value)}
              >
                <SelectTrigger id="text-transform" className="h-9">
                  <SelectValue placeholder="Select transform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="uppercase">Uppercase</SelectItem>
                  <SelectItem value="lowercase">Lowercase</SelectItem>
                  <SelectItem value="capitalize">Capitalize</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <SliderWithInput 
              value={styles.letterSpacing} 
              onChange={(value) => updateStyle('letterSpacing', value)} 
              min={-0.1} 
              max={0.5} 
              step={0.01} 
              label="Letter Spacing" 
              unit="em"
            />
            
            <SliderWithInput 
              value={styles.lineHeight} 
              onChange={(value) => updateStyle('lineHeight', value)} 
              min={0.7} 
              max={2} 
              step={0.1} 
              label="Line Height" 
              unit="x"
            />
          </ControlSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
