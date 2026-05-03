export type GalleryPhoto = {
  src: string;
  alt: string;
};

export type GalleryCategory = {
  id: string;
  title: string;
  description: string;
  photos: GalleryPhoto[];
};

type PhotoT = (key: string) => string;

/**
 * Returns gallery categories with alt texts looked up via the provided
 * translation function (from `getTranslations('gallery_data.photos')`).
 */
export function getGalleryCategories(tp: PhotoT): GalleryCategory[] {
  return [
    {
      id: "restoran",
      title: "restoran",
      description: "restoran",
      photos: [
        { src: "/images/restaurant/hall_floor1_rustic_wide.jpg", alt: tp("hall_floor1_rustic_wide") },
        { src: "/images/restaurant/hall_floor1_round_tables.jpg", alt: tp("hall_floor1_round_tables") },
        { src: "/images/restaurant/hall_floor2_balcony_door.jpg", alt: tp("hall_floor2_balcony_door") },
        { src: "/images/restaurant/hall_fireplace_balcony.jpg", alt: tp("hall_fireplace_balcony") },
        { src: "/images/restaurant/hall_oven.jpg", alt: tp("hall_oven") },
        { src: "/images/restaurant/hall_terrace.jpg", alt: tp("hall_terrace") },
        { src: "/images/restaurant/hall_banquet.jpg", alt: tp("hall_banquet") },
        { src: "/images/restaurant/hall_private.jpg", alt: tp("hall_private") },
        { src: "/images/restaurant/bar_rustic_tree_trunk.jpg", alt: tp("bar_rustic_tree_trunk") },
        { src: "/images/restaurant/balcony_floor2_wooden_furniture.jpg", alt: tp("balcony_floor2_wooden_furniture") },
        { src: "/images/restaurant/exterior_summer_terrace_water.jpg", alt: tp("exterior_summer_terrace_water") },
        { src: "/images/restaurant/decor_photozone_green_hedge.jpg", alt: tp("decor_photozone_green_hedge") },
      ],
    },
    {
      id: "laznya",
      title: "laznya",
      description: "laznya",
      photos: [
        { src: "/images/sauna/pool_big_sauna_indoor_full.jpg", alt: tp("pool_big_sauna_indoor_full") },
        { src: "/images/sauna/pool_big_sauna_indoor_diving.jpg", alt: tp("pool_big_sauna_indoor_diving") },
        { src: "/images/sauna/chan_carpathian_herbs_steam.jpg", alt: tp("chan_carpathian_herbs_steam") },
        { src: "/images/sauna/chan_citrus_couple_night.jpg", alt: tp("chan_citrus_couple_night") },
        { src: "/images/sauna/chan_exterior_stone_steps.jpg", alt: tp("chan_exterior_stone_steps") },
        { src: "/images/sauna/relaxation_room_big_sauna_leather_sofa.jpg", alt: tp("relaxation_room_big_sauna_leather_sofa") },
        { src: "/images/sauna/relaxation_room_samovar_interior.jpg", alt: tp("relaxation_room_samovar_interior") },
        { src: "/images/sauna/couple_drinking_beer_sauna_hats.jpg", alt: tp("couple_drinking_beer_sauna_hats") },
        { src: "/images/sauna/craft_kvas_in_sauna.jpg", alt: tp("craft_kvas_in_sauna") },
        { src: "/images/sauna/honey_jar_gluhoman.jpg", alt: tp("honey_jar_gluhoman") },
        { src: "/images/sauna/exterior_small_sauna_building.jpg", alt: tp("exterior_small_sauna_building") },
      ],
    },
    {
      id: "akvapark",
      title: "akvapark",
      description: "akvapark",
      photos: [
        { src: "/images/akvapark.webp", alt: tp("akvapark_main") },
        { src: "/images/restaurant/aquapark_entrance_family.jpg", alt: tp("aquapark_entrance_family") },
        { src: "/images/9.jpg", alt: tp("akvapark_9") },
      ],
    },
    {
      id: "podii",
      title: "podii",
      description: "podii",
      photos: [
        { src: "/images/restaurant/event_01.jpg", alt: tp("event_01") },
        { src: "/images/restaurant/event_02.jpg", alt: tp("event_02") },
        { src: "/images/restaurant/event_03.jpg", alt: tp("event_03") },
        { src: "/images/restaurant/event_04_music.jpg", alt: tp("event_04_music") },
        { src: "/images/restaurant/event_birthday_balloon_decor.jpg", alt: tp("event_birthday_balloon_decor") },
        { src: "/images/restaurant/event_fruit_table_terrace.jpg", alt: tp("event_fruit_table_terrace") },
        { src: "/images/restaurant/animation_clown_with_child.jpg", alt: tp("animation_clown_with_child") },
        { src: "/images/restaurant/animation_kids_pirate_night.jpg", alt: tp("animation_kids_pirate_night") },
        { src: "/images/restaurant/animation_lasertag_kids_outdoor.jpg", alt: tp("animation_lasertag_kids_outdoor") },
        { src: "/images/restaurant/event_happy_birthday_number1_red.jpg", alt: tp("event_happy_birthday_number1_red") },
      ],
    },
    {
      id: "pryroda",
      title: "pryroda",
      description: "pryroda",
      photos: [
        { src: "/images/sauna/chan_exterior_stone_steps.jpg", alt: tp("chan_exterior_stone_steps_nature") },
        { src: "/images/sauna/exterior_small_sauna_chan_platform.jpg", alt: tp("exterior_small_sauna_chan_platform") },
        { src: "/images/sauna/chan_citrus_couple_night.jpg", alt: tp("chan_citrus_couple_night_nature") },
        { src: "/images/33.jpg", alt: tp("nature_33") },
      ],
    },
  ];
}

/** Kept for backward compat — call getGalleryCategories(tp) instead. */
export const GALLERY_CATEGORIES: GalleryCategory[] = getGalleryCategories(() => "");

export const GALLERY_ALL_PHOTOS: GalleryPhoto[] = GALLERY_CATEGORIES.flatMap(
  (category) => category.photos
);
