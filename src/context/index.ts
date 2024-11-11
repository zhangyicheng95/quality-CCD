import { createContext } from 'react';
import { fabric } from 'fabric';
import Editor from '@/components/fabritor/editor';
export interface IGloablStateContext {
  data: any;
  object?: fabric.Object | null | undefined;
  setActiveObject?: (o: fabric.Object) => void;
  isReady?: boolean;
  setReady?: (o: boolean) => void;
  editor?: Editor;
  roughSvg?: any;
  fetchType?: any;
  xName?: any;
  yName?: any;
  theme?: string;
  addImage?: any;
}

export const GloablStateContext = createContext<IGloablStateContext>(null);