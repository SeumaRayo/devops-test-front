import { ElementType } from 'react';

export interface NavItemType {
  id: string;
  title: string;
  icon: ElementType;
  path?: string;
  subModules?: NavItemType[];
}
