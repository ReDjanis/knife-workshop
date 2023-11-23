'use strict'

const products = [
    {
        id: 2_01,
        src_1: './images/content/gallery/2_01.avif',
        src_2: './images/content/products/2_01_02.avif',
        src_3: './images/content/products/2_01_03.avif',
        src_4: './images/content/products/2_01_04.avif',
        src_5: './images/content/products/2_01_05.avif',
        src_6: './images/content/products/2_01_06.avif',
        src_7: './images/content/products/2_01_07.avif',
        src_8: './images/content/products/2_01_08.avif',
        src_9: './images/content/products/2_01_09.avif',
        src_10: './images/content/products/2_01_10.avif',
        title: "Нож. Финка",
        subtitle: "Дамасская сталь",
        descriptionBlade: "Клинок: Дамасская сталь, закалка 60 hrc.",
        descriptionHandle: "Рукоять: Карельская берёза, чёрный граб, бронза.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_02,
        src_1: './images/content/gallery/2_02.avif',
        src_2: './images/content/products/2_02_02.avif',
        src_3: './images/content/products/2_02_03.avif',
        src_4: './images/content/products/2_02_04.avif',
        src_5: './images/content/products/2_02_05.avif',
        src_6: './images/content/products/2_02_06.avif',
        src_7: './images/content/products/2_02_07.avif',
        title: "Нож. Сборный",
        subtitle: "Сталь Bohler s390",
        descriptionBlade: "Клинок: сталь Bohler s390, 68 hrc.",
        descriptionHandle: "Рукоять: Аризонское железное дерево (Ironwood), больстер титан.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_03,
        src_1: './images/content/gallery/2_03.avif',
        src_2: './images/content/products/2_03_02.avif',
        src_3: './images/content/products/2_03_03.avif',
        src_4: './images/content/products/2_03_04.avif',
        src_5: './images/content/products/2_03_05.avif',
        src_6: './images/content/products/2_03_06.avif',
        src_7: './images/content/products/2_03_07.avif',
        src_8: './images/content/products/2_03_08.avif',
        src_9: './images/content/products/2_03_09.avif',
        title: "Нож",
        subtitle: "Cталь х12мф",
        descriptionBlade: "Клинок: сталь х12мф, обработка клинка stonewash, закалка 59 hrc.",
        descriptionHandle: "Рукоять: чёрный граб, рог лося, бронза, фибра, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка, рог лося, чёрный граб.",
    },
    {
        id: 2_04,
        src_1: './images/content/gallery/2_04.avif',
        src_2: './images/content/products/2_04_02.avif',
        src_3: './images/content/products/2_04_03.avif',
        src_4: './images/content/products/2_04_04.avif',
        src_5: './images/content/products/2_04_05.avif',
        src_6: './images/content/products/2_04_06.avif',
        src_7: './images/content/products/2_04_07.avif',
        src_8: './images/content/products/2_04_08.avif',
        src_9: './images/content/products/2_04_09.avif',
        title: "Нож",
        subtitle: "Cталь 5160 (США)",
        descriptionBlade: "Клинок: сталь 5160 (США), закалка 57 hrc.",
        descriptionHandle: "Рукоять: дуб, дюралюминий, фибра, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_05,
        src_1: './images/content/products/2_05_03.avif',
        src_2: './images/content/products/2_05_02.avif',
        src_3: './images/content/gallery/2_05.avif',
        src_4: './images/content/products/2_05_04.avif',
        src_5: './images/content/products/2_05_05.avif',
        src_6: './images/content/products/2_05_06.avif',
        src_7: './images/content/products/2_05_07.avif',
        src_8: './images/content/products/2_05_08.avif',
        title: "Нож",
        subtitle: "Cталь 5160 (США)",
        descriptionBlade: "Клинок: сталь 5160 (США), закалка 57 hrc.",
        descriptionHandle: "Рукоять: дуб, мамонт, титан, фибра, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_06,
        src_1: './images/content/gallery/2_06.avif',
        src_2: './images/content/products/2_06_02.avif',
        src_3: './images/content/products/2_06_03.avif',
        src_4: './images/content/products/2_06_04.avif',
        src_5: './images/content/products/2_06_05.avif',
        src_6: './images/content/products/2_06_06.avif',
        src_7: './images/content/products/2_06_07.avif',
        src_8: './images/content/products/2_06_08.avif',
        src_9: './images/content/products/2_06_09.avif',
        src_10: './images/content/products/2_06_10.avif',
        title: "Нож. Финка",
        subtitle: "Cталь У8",
        descriptionBlade: "Клинок: сталь У8, воронение, закалка 60 hrc.",
        descriptionHandle: "Рукоять: карельская берёза, фибра, бронза.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_07,
        src_1: './images/content/products/2_07.avif',
        src_2: './images/content/products/2_07_02.avif',
        src_3: './images/content/products/2_07_03.avif',
        src_4: './images/content/products/2_07_04.avif',
        src_5: './images/content/products/2_07_05.avif',
        src_6: './images/content/products/2_07_06.avif',
        src_7: './images/content/products/2_07_07.avif',
        title: "Нож. Лёлик",
        subtitle: "Cталь х12мф",
        descriptionBlade: "Клинок: сталь х12мф, обработка клинка stonewash, закалка 59 hrc.",
        descriptionHandle: "Рукоять: Карельская берёза, падук, бронза, фибра, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_08,
        src_1: './images/content/products/2_08_01.avif',
        src_2: './images/content/products/2_08_02.avif',
        src_3: './images/content/products/2_08_03.avif',
        src_4: './images/content/products/2_08_04.avif',
        src_5: './images/content/products/2_08_05.avif',
        title: "Нож. Болик",
        subtitle: "Cталь х12мф",
        descriptionBlade: "Клинок: сталь х12мф, обработка клинка stonewash, закалка 59 hrc.",
        descriptionHandle: "Рукоять: Карельская берёза, микарта, бронза, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_09,
        src_1: './images/content/products/2_09_01.avif',
        src_2: './images/content/products/2_09_02.avif',
        src_3: './images/content/products/2_09_03.avif',
        src_4: './images/content/products/2_09_04.avif',
        src_5: './images/content/products/2_09_05.avif',
        src_6: './images/content/products/2_09_06.avif',
        src_7: './images/content/products/2_09_07.avif',
        title: "Нож. Трудоголик",
        subtitle: "Cталь х12мф",
        descriptionBlade: "Клинок: сталь х12мф, обработка клинка stonewash, закалка 59 hrc.",
        descriptionHandle: "Рукоять: Граб, Чёрный граб, бронза, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_10,
        src_1: './images/content/products/2_10_01.avif',
        src_2: './images/content/products/2_10_02.avif',
        src_3: './images/content/products/2_10_03.avif',
        src_4: './images/content/products/2_10_04.avif',
        src_5: './images/content/products/2_10_05.avif',
        src_6: './images/content/products/2_10_06.avif',
        title: "Нож. Крыска",
        subtitle: "Cталь х12мф",
        descriptionBlade: "Клинок: сталь х12мф, обработка клинка stonewash, закалка 59 hrc.",
        descriptionHandle: "Рукоять: Чёрный граб, Карельская берёза, бронза, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
    {
        id: 2_11,
        src_1: './images/content/products/2_11_01.avif',
        src_2: './images/content/products/2_11_02.avif',
        src_3: './images/content/products/2_11_03.avif',
        src_4: './images/content/products/2_11_04.avif',
        src_5: './images/content/products/2_11_05.avif',
        src_6: './images/content/products/2_11_06.avif',
        src_7: './images/content/products/2_11_07.avif',
        src_8: './images/content/products/2_11_08.avif',
        src_9: './images/content/products/2_11_09.avif',
        src_10: './images/content/products/2_11_10.avif',
        title: "Нож. Совелий",
        subtitle: "Cталь У12",
        descriptionBlade: "Клинок: сталь У12, зонная закалка, твердость 58hrc.",
        descriptionHandle: "Рукоять: Карельская берёза, литьё мельхиор, проставки фибра, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка, финиш.",
    },
    {
        id: 2_12,
        src_1: './images/content/products/2_12_01.avif',
        src_2: './images/content/products/2_12_02.avif',
        src_3: './images/content/products/2_12_03.avif',
        src_4: './images/content/products/2_12_04.avif',
        src_5: './images/content/products/2_12_05.avif',
        src_6: './images/content/products/2_12_06.avif',
        src_7: './images/content/products/2_12_07.avif',
        src_8: './images/content/products/2_12_08.avif',
        src_9: './images/content/products/2_12_09.avif',
        title: "Нож",
        subtitle: "Дамасская сталь",
        descriptionBlade: "Клинок: дамаск, твердость 60hrc.",
        descriptionHandle: "Рукоять: платан, патинированная бронза, фибра, пропитка.",
        descriptionScabbard: "Ножны: разборные на браслет и футляр, кожа, кожа змеи, покраска, пропитка, финиш.",
    },
    {
        id: 4_01,
        src_1: './images/content/gallery/4_01.avif',
        src_2: './images/content/products/4_01_02.avif',
        src_3: './images/content/products/4_01_03.avif',
        src_4: './images/content/products/4_01_04.avif',
        src_5: './images/content/products/4_01_05.avif',
        src_6: './images/content/products/4_01_06.avif',
        src_7: './images/content/products/4_01_07.avif',
        src_8: './images/content/products/4_01_08.avif',
        src_9: './images/content/products/4_01_09.avif',
        src_10: './images/content/products/4_01_10.avif',
        title: "Топорик",
        subtitle: "Сталь 60с2а",
        descriptionBlade: "Клинок: сталь 60с2а, закалка 55 hrc.",
        descriptionHandle: "Рукоять: Карельская берёза, амарант, фибра, пропитка.",
        descriptionScabbard: "Ножны: кожа, покраска, пропитка.",
    },
];
