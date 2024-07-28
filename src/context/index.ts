import { createContext } from 'react';
import { fabric } from 'fabric';
import Editor from '@/components/fabritor/editor';
export interface IGloablStateContext {
  object?: fabric.Object | null | undefined;
  setActiveObject?: (o: fabric.Object) => void;
  isReady?: boolean;
  setReady?: (o: boolean) => void;
  editor?: Editor;
  roughSvg?: any;
  onLoadTypeChange?: any;
  theme?: string;
}

export const GloablStateContext = createContext<IGloablStateContext>(null);