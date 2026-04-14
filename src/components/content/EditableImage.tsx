import Image from 'next/image';
import { getImage } from '@/lib/site-content';

interface Props {
  k: string;
  fallback: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export async function EditableImage({
  k,
  fallback,
  alt,
  className,
  sizes,
  priority,
  fill = true,
  width,
  height,
}: Props) {
  const src = await getImage(k, fallback);
  const isUpload = src.startsWith('/uploads/');

  if (!fill && width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={isUpload}
        data-content-key={k}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isUpload}
      data-content-key={k}
    />
  );
}
