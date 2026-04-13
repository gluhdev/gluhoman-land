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

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: "restoran",
    title: "Ресторан і зали",
    description:
      "Автентичні інтер'єри, простора тераса біля води та затишні приватні кімнати для будь-якої події.",
    photos: [
      { src: "/images/restaurant/hall_floor1_rustic_wide.jpg", alt: "Перший поверх ресторану в рустикальному стилі" },
      { src: "/images/restaurant/hall_floor1_round_tables.jpg", alt: "Круглі столи на першому поверсі залу" },
      { src: "/images/restaurant/hall_floor2_balcony_door.jpg", alt: "Другий поверх із виходом на балкон" },
      { src: "/images/restaurant/hall_fireplace_balcony.jpg", alt: "Зал з каміном та балконом" },
      { src: "/images/restaurant/hall_oven.jpg", alt: "Українська піч у ресторанному залі" },
      { src: "/images/restaurant/hall_terrace.jpg", alt: "Літня тераса ресторану" },
      { src: "/images/restaurant/hall_banquet.jpg", alt: "Банкетний зал з сервіруванням" },
      { src: "/images/restaurant/hall_private.jpg", alt: "Приватний зал для невеликих компаній" },
      { src: "/images/restaurant/bar_rustic_tree_trunk.jpg", alt: "Рустикальний бар зі стовбура дерева" },
      { src: "/images/restaurant/balcony_floor2_wooden_furniture.jpg", alt: "Балкон другого поверху з дерев'яними меблями" },
      { src: "/images/restaurant/exterior_summer_terrace_water.jpg", alt: "Літня тераса біля води" },
      { src: "/images/restaurant/decor_photozone_green_hedge.jpg", alt: "Фотозона із зеленим живоплотом" },
    ],
  },
  {
    id: "laznya",
    title: "Лазня",
    description:
      "Велика лазня з басейном, чани на відкритому повітрі та затишні кімнати відпочинку з самоваром.",
    photos: [
      { src: "/images/sauna/pool_big_sauna_indoor_full.jpg", alt: "Внутрішній басейн великої лазні" },
      { src: "/images/sauna/pool_big_sauna_indoor_diving.jpg", alt: "Басейн великої лазні з майданчиком" },
      { src: "/images/sauna/chan_carpathian_herbs_steam.jpg", alt: "Чан з карпатськими травами" },
      { src: "/images/sauna/chan_citrus_couple_night.jpg", alt: "Пара в цитрусовому чані вночі" },
      { src: "/images/sauna/chan_exterior_stone_steps.jpg", alt: "Чан на вулиці з кам'яними сходами" },
      { src: "/images/sauna/relaxation_room_big_sauna_leather_sofa.jpg", alt: "Кімната відпочинку великої лазні зі шкіряним диваном" },
      { src: "/images/sauna/relaxation_room_samovar_interior.jpg", alt: "Інтер'єр кімнати відпочинку з самоваром" },
      { src: "/images/sauna/couple_drinking_beer_sauna_hats.jpg", alt: "Пара відпочиває в лазні з пивом" },
      { src: "/images/sauna/craft_kvas_in_sauna.jpg", alt: "Крафтовий квас у лазні" },
      { src: "/images/sauna/honey_jar_gluhoman.jpg", alt: "Банка меду Глухомань" },
      { src: "/images/sauna/exterior_small_sauna_building.jpg", alt: "Зовнішній вигляд малої лазні" },
    ],
  },
  {
    id: "akvapark",
    title: "Аквапарк",
    description: "Родинні розваги на воді просто на території комплексу.",
    photos: [
      { src: "/images/akvapark.webp", alt: "Аквапарк Глухомань" },
      { src: "/images/restaurant/aquapark_entrance_family.jpg", alt: "Родина біля входу до аквапарку" },
      { src: "/images/9.jpg", alt: "Атракціони аквапарку" },
    ],
  },
  {
    id: "podii",
    title: "Події",
    description: "Весілля, дні народження, корпоративи, дитячі свята та жива музика.",
    photos: [
      { src: "/images/restaurant/event_01.jpg", alt: "Святкова подія у Глухомані" },
      { src: "/images/restaurant/event_02.jpg", alt: "Оформлення зали для події" },
      { src: "/images/restaurant/event_03.jpg", alt: "Гості на святковій події" },
      { src: "/images/restaurant/event_04_music.jpg", alt: "Жива музика на події" },
      { src: "/images/restaurant/event_birthday_balloon_decor.jpg", alt: "Декор день народження з повітряними кульками" },
      { src: "/images/restaurant/event_fruit_table_terrace.jpg", alt: "Фруктовий стіл на терасі" },
      { src: "/images/restaurant/animation_clown_with_child.jpg", alt: "Аніматор-клоун з дитиною" },
      { src: "/images/restaurant/animation_kids_pirate_night.jpg", alt: "Дитяча піратська вечірка" },
      { src: "/images/restaurant/animation_lasertag_kids_outdoor.jpg", alt: "Лазертаг для дітей на вулиці" },
      { src: "/images/restaurant/event_happy_birthday_number1_red.jpg", alt: "Оформлення дня народження" },
    ],
  },
  {
    id: "pryroda",
    title: "Природа",
    description: "Мальовнича територія комплексу серед зелені та води.",
    photos: [
      { src: "/images/sauna/chan_exterior_stone_steps.jpg", alt: "Чан серед природи" },
      { src: "/images/sauna/exterior_small_sauna_chan_platform.jpg", alt: "Мала лазня з платформою чану" },
      { src: "/images/sauna/chan_citrus_couple_night.jpg", alt: "Чан під нічним небом" },
      { src: "/images/33.jpg", alt: "Природа навколо Глухомані" },
    ],
  },
];

export const GALLERY_ALL_PHOTOS: GalleryPhoto[] = GALLERY_CATEGORIES.flatMap(
  (category) => category.photos
);
