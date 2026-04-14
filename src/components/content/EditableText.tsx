import { getText } from '@/lib/site-content';
import { createElement, type ReactNode } from 'react';

type HtmlTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'strong' | 'em' | 'div';

interface Props {
  k: string;
  fallback: string;
  as?: HtmlTag;
  className?: string;
  children?: (value: string) => ReactNode;
}

export async function EditableText({ k, fallback, as = 'span', className, children }: Props) {
  const value = await getText(k, fallback);
  if (children) {
    return <>{children(value)}</>;
  }
  return createElement(as, { className, 'data-content-key': k }, value);
}
