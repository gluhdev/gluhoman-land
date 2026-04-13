import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { AddToCartButton } from './AddToCartButton';

/**
 * Editorial DishCard — used only for items with images.
 * Flat cream surface, hairline details, no shadows or scale hovers.
 */
export function DishCard({ item }: { item: MenuItem }) {
  return (
    <article className="relative bg-[#faf6ec] flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f4ecd8]">
        <Image
          src={item.image!}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
          loading="eager"
          className="object-cover"
        />
        {item.weight && (
          <div className="absolute bottom-3 left-3 bg-[#0f1f18] text-[#e6d9b8] text-[10px] font-medium uppercase tracking-[0.22em] px-3 py-1">
            {item.weight}
          </div>
        )}
      </div>

      <div className="relative p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-xl md:text-2xl font-light leading-snug text-[#0f1f18]">
            {item.name}
          </h3>
          <span className="inline-flex items-baseline gap-0.5 bg-[#e6d9b8] text-[#0f1f18] font-display text-base px-3 py-1 whitespace-nowrap">
            <span>{item.price}</span>
            <span className="text-[11px]">₴</span>
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-[#1a3d2e]/70 leading-relaxed line-clamp-3 flex-1">
            {item.description}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 border border-[#1a3d2e]/20 px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-[#1a3d2e]/10">
          <AddToCartButton
            variant="card"
            item={{
              menuItemId: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              weight: item.weight,
            }}
          />
        </div>
      </div>
    </article>
  );
}
