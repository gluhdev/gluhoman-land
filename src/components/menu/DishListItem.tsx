import { MenuItem } from '@/types/menu';
import { AddToCartButton } from './AddToCartButton';

export function DishListItem({ item }: { item: MenuItem }) {
  return (
    <div className="group relative flex items-start gap-6 py-6 px-2">
      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-xl md:text-2xl font-light leading-snug text-[#0f1f18]">
          {item.name}
        </h4>
        {item.description && (
          <p className="font-display italic text-[15px] text-[#1a3d2e]/65 mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Right rail: weight + price chip */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {item.weight && (
          <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/55 whitespace-nowrap hidden sm:inline">
            {item.weight}
          </span>
        )}
        <span className="inline-flex items-baseline gap-0.5 bg-[#e6d9b8] text-[#0f1f18] font-display text-base px-3 py-1 whitespace-nowrap tabular-nums">
          <span>{item.price}</span>
          <span className="text-[11px]">₴</span>
        </span>
        <AddToCartButton
          variant="list"
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
  );
}
