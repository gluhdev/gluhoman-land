import { MenuCategory } from '@/types/menu';
import { DishCard } from './DishCard';
import { DishListItem } from './DishListItem';

/**
 * Editorial category block — hairline dividers and generous rhythm.
 * The page renders all sections inside a single cream container.
 */
export function CategorySection({ category }: { category: MenuCategory }) {
  const withImages = category.items.filter((i) => i.image);
  const withoutImages = category.items.filter((i) => !i.image);
  const count = category.items.length;
  const countLabel = count === 1 ? 'позиція' : count < 5 ? 'позиції' : 'позицій';

  return (
    <section
      id={category.id}
      className="scroll-mt-32 py-16 md:py-20 border-t border-[#1a3d2e]/10 first:border-t-0 first:pt-4"
    >
      {/* Editorial header */}
      <header className="mb-12 md:mb-14">
        <div className="flex items-center gap-4 mb-6">
          {category.icon && (
            <span className="text-xl text-[#1a3d2e]/70">{category.icon}</span>
          )}
          <span className="h-px flex-1 max-w-[60px] bg-[#1a3d2e]/30" />
          <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/60">
            {count} {countLabel}
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] text-[#0f1f18]">
          {category.name}
        </h2>
      </header>

      {/* Items WITH image — editorial card grid (hairline dividers via gap-px) */}
      {withImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#e6d9b8]">
          {withImages.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Items WITHOUT image — editorial list */}
      {withoutImages.length > 0 && (
        <div
          className={`border-y border-[#1a3d2e]/15 divide-y divide-[#1a3d2e]/10 ${
            withImages.length > 0 ? 'mt-12' : ''
          }`}
        >
          {withoutImages.map((item) => (
            <DishListItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
