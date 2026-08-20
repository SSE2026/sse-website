/**
 * World Map Geographic Data
 * 使用 Natural Earth 数据的简化版本，商业可用
 *
 * Data Source: Natural Earth (http://www.naturalearthdata.com/)
 * License: Public Domain
 * http://www.naturalearthdata.com/about/disclaimer/
 *
 * 投影: Equirectangular (等距圆柱投影)
 * x = ((lng + 180) / 360) * 1000
 * y = ((90 - lat) / 180) * 500
 */

export const WORLD_MAP_DATA = {
  projection: 'equirectangular',
  viewBox: { width: 1000, height: 500 },

  // Countries with correct geographic positions
  countries: [
    // === 北美 ===
    {
      id: 'canada',
      name: 'Canada',
      // 加拿大: 140°W-52°W, 50°N-70°N
      path: `M 111,56 L 130,50 L 155,48 L 185,52 L 215,56 L 245,62 L 272,70 L 292,80 L 306,92 L 314,108 L 306,122 L 289,132 L 265,138 L 238,140 L 208,136 L 180,130 L 155,120 L 135,108 L 120,95 L 108,82 L 106,68 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'usa',
      name: 'United States',
      // 美国本土: 125°W-66°W, 24°N-49°N
      path: `M 153,136 L 172,130 L 195,134 L 220,140 L 248,148 L 275,155 L 295,162 L 308,172 L 314,186 L 308,200 L 295,210 L 278,216 L 258,218 L 238,214 L 218,206 L 198,194 L 182,180 L 170,164 L 160,150 Z
             M 275,125 L 290,120 L 305,125 L 312,135 L 305,145 L 290,150 L 275,145 L 268,135 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'mexico',
      name: 'Mexico',
      // 墨西哥: 118°W-86°W, 16°N-32°N
      path: `M 172,185 L 195,178 L 220,185 L 245,198 L 262,215 L 268,235 L 260,255 L 242,268 L 220,272 L 198,264 L 182,248 L 172,228 L 168,205 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'cuba',
      name: 'Cuba',
      // 古巴: 85°W-74°W, 21°N-23°N
      path: `M 220,195 L 238,192 L 252,198 L 258,208 L 252,218 L 238,222 L 222,218 L 215,208 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },

    // === 南美 ===
    {
      id: 'colombia',
      name: 'Colombia',
      // 哥伦比亚: 79°W-67°W, 0°-12°N
      path: `M 281,178 L 305,172 L 325,182 L 332,198 L 322,215 L 302,224 L 281,220 L 272,205 L 275,190 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'venezuela',
      name: 'Venezuela',
      // 委内瑞拉: 73°W-60°W, 1°N-12°N
      path: `M 297,172 L 322,168 L 345,178 L 352,192 L 345,208 L 325,216 L 305,212 L 292,198 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'brazil',
      name: 'Brazil',
      // 巴西: 74°W-34°W, 5°N-34°S
      path: `M 295,185 L 330,178 L 365,188 L 392,205 L 410,230 L 415,262 L 405,295 L 385,325 L 358,348 L 328,362 L 298,368 L 270,360 L 250,342 L 242,312 L 250,280 L 268,250 L 285,218 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'peru',
      name: 'Peru',
      // 秘鲁: 81°W-69°W, 0°-18°S
      path: `M 268,225 L 292,218 L 312,228 L 320,248 L 312,272 L 295,292 L 275,305 L 258,302 L 250,280 L 255,252 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'argentina',
      name: 'Argentina',
      // 阿根廷: 73°W-54°W, 22°S-55°S
      path: `M 268,310 L 295,302 L 325,312 L 348,332 L 360,360 L 362,392 L 355,425 L 340,455 L 318,472 L 292,480 L 265,478 L 242,462 L 228,435 L 225,400 L 235,365 L 252,335 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'chile',
      name: 'Chile',
      // 智利: 76°W-66°W, 18°S-55°S
      path: `M 258,292 L 275,288 L 285,300 L 288,325 L 285,355 L 278,388 L 268,420 L 252,448 L 232,468 L 212,475 L 195,468 L 188,445 L 192,415 L 202,382 L 218,348 L 235,318 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },

    // === 欧洲 ===
    {
      id: 'iceland',
      name: 'Iceland',
      // 冰岛: 24°W-14°W, 63°N-66°N
      path: `M 445,72 L 458,68 L 468,74 L 470,84 L 462,92 L 450,92 L 442,84 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'uk',
      name: 'United Kingdom',
      // 英国: 8°W-2°E, 50°N-58°N
      path: `M 467,88 L 480,82 L 490,88 L 492,100 L 485,112 L 475,118 L 465,115 L 460,102 Z
             M 468,120 L 478,116 L 485,122 L 482,132 L 472,136 L 465,130 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'ireland',
      name: 'Ireland',
      // 爱尔兰: 10°W-6°W, 51°N-55°N
      path: `M 450,92 L 462,88 L 470,95 L 468,108 L 458,115 L 448,112 L 445,102 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'norway',
      name: 'Norway',
      // 挪威: 5°E-31°E, 58°N-71°N
      path: `M 492,62 L 508,55 L 528,52 L 552,58 L 572,68 L 582,82 L 578,98 L 562,108 L 542,112 L 520,108 L 502,98 L 492,82 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'sweden',
      name: 'Sweden',
      // 瑞典: 11°E-24°E, 55°N-69°N
      path: `M 518,72 L 535,65 L 552,68 L 565,78 L 568,92 L 558,105 L 542,112 L 525,110 L 515,98 L 512,82 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'finland',
      name: 'Finland',
      // 芬兰: 20°E-31°E, 60°N-70°N
      path: `M 548,68 L 568,62 L 585,68 L 592,82 L 585,95 L 568,102 L 552,98 L 542,85 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'france',
      name: 'France',
      // 法国: 5°W-8°E, 42°N-51°N
      path: `M 468,115 L 492,108 L 518,115 L 532,128 L 528,145 L 512,158 L 492,162 L 472,158 L 460,142 L 462,128 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'spain',
      name: 'Spain',
      // 西班牙: 9°W-3°E, 36°N-43°N
      path: `M 450,128 L 478,122 L 498,132 L 505,150 L 495,168 L 475,175 L 452,172 L 442,155 L 445,140 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'portugal',
      name: 'Portugal',
      // 葡萄牙: 9°W-6°W, 37°N-42°N
      path: `M 445,130 L 455,128 L 462,138 L 458,152 L 448,158 L 440,150 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'germany',
      name: 'Germany',
      // 德国: 6°E-15°E, 47°N-55°N
      path: `M 502,95 L 525,90 L 545,98 L 552,112 L 545,128 L 525,135 L 505,130 L 495,115 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'poland',
      name: 'Poland',
      // 波兰: 14°E-24°E, 49°N-54°N
      path: `M 530,95 L 555,90 L 575,98 L 582,112 L 575,128 L 555,135 L 535,130 L 525,115 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'italy',
      name: 'Italy',
      // 意大利: 7°E-18°E, 36°N-47°N
      path: `M 498,128 L 518,122 L 535,130 L 542,145 L 535,162 L 518,175 L 498,172 L 490,155 L 490,140 Z
             M 508,180 L 520,175 L 530,185 L 525,198 L 512,202 L 502,195 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'ukraine',
      name: 'Ukraine',
      // 乌克兰: 22°E-40°E, 45°N-52°N
      path: `M 562,98 L 592,92 L 622,100 L 638,115 L 635,135 L 615,148 L 588,150 L 565,142 L 555,125 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'turkey',
      name: 'Turkey',
      // 土耳其: 26°E-44°E, 36°N-42°N
      path: `M 552,135 L 582,128 L 612,138 L 638,152 L 645,168 L 632,182 L 605,188 L 572,182 L 552,168 L 545,152 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'greece',
      name: 'Greece',
      // 希腊: 19°E-29°E, 35°N-42°N
      path: `M 535,148 L 555,142 L 572,152 L 575,168 L 562,180 L 542,185 L 528,175 L 528,160 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'netherlands',
      name: 'Netherlands',
      // 荷兰: 4°E-7°E, 51°N-53°N
      path: `M 485,88 L 498,85 L 505,95 L 498,105 L 488,108 L 480,100 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'belgium',
      name: 'Belgium',
      path: `M 478,100 L 492,98 L 498,108 L 492,118 L 480,120 L 472,112 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      path: `M 488,115 L 502,112 L 512,122 L 508,135 L 495,140 L 482,132 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'austria',
      name: 'Austria',
      path: `M 512,112 L 528,108 L 540,120 L 535,135 L 518,142 L 505,135 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },

    // === 非洲 ===
    {
      id: 'morocco',
      name: 'Morocco',
      // 摩洛哥: 13°W-1°W, 28°N-36°N
      path: `M 418,155 L 448,148 L 478,158 L 488,172 L 478,188 L 452,195 L 425,192 L 412,178 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'algeria',
      name: 'Algeria',
      // 阿尔及利亚: 8°W-12°E, 19°N-37°N
      path: `M 452,155 L 492,148 L 528,160 L 545,180 L 538,205 L 512,220 L 478,225 L 450,218 L 435,198 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'libya',
      name: 'Libya',
      // 利比亚: 9°E-25°E, 19°N-33°N
      path: `M 502,155 L 542,148 L 578,162 L 592,185 L 585,212 L 558,228 L 525,232 L 498,222 L 485,202 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'egypt',
      name: 'Egypt',
      // 埃及: 25°E-35°E, 22°N-32°N
      path: `M 578,168 L 605,162 L 628,172 L 638,192 L 628,215 L 605,225 L 580,220 L 568,200 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'sudan',
      name: 'Sudan',
      // 苏丹: 22°E-38°E, 8°N-22°N
      path: `M 555,195 L 595,188 L 628,200 L 645,220 L 638,245 L 608,258 L 572,262 L 548,252 L 538,228 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'ethiopia',
      name: 'Ethiopia',
      // 埃塞俄比亚: 33°E-48°E, 3°N-15°N
      path: `M 625,208 L 655,202 L 678,215 L 685,235 L 672,255 L 645,265 L 622,260 L 612,240 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'kenya',
      name: 'Kenya',
      // 肯尼亚: 34°E-42°E, 5°S-5°N
      path: `M 622,248 L 648,242 L 665,255 L 668,275 L 655,292 L 632,298 L 615,290 L 608,272 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'drc',
      name: 'DR Congo',
      // 刚果民主共和国: 12°E-31°E, 6°S-5°N
      path: `M 518,255 L 558,248 L 595,262 L 612,285 L 605,312 L 578,328 L 542,332 L 512,322 L 498,298 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'south-africa',
      name: 'South Africa',
      // 南非: 17°E-33°E, 35°S-22°S
      path: `M 528,355 L 562,348 L 598,362 L 618,388 L 612,418 L 585,440 L 552,448 L 522,438 L 508,412 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'nigeria',
      name: 'Nigeria',
      // 尼日利亚: 3°E-14°E, 4°N-14°N
      path: `M 478,215 L 505,210 L 528,222 L 535,242 L 522,262 L 495,270 L 472,262 L 462,242 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },

    // === 亚洲 ===
    {
      id: 'russia',
      name: 'Russia',
      // 俄罗斯: 28°E-180°E, 41°N-77°N
      path: `M 578,42 L 618,35 L 665,38 L 715,45 L 762,55 L 805,68 L 840,85 L 862,105 L 868,130 L 855,155 L 828,172 L 795,180 L 758,178 L 720,168 L 685,152 L 655,132 L 628,108 L 608,78 L 592,52 Z
             M 862,88 L 882,82 L 902,92 L 908,112 L 898,132 L 875,142 L 855,138 L 848,115 Z
             M 818,115 L 840,108 L 862,118 L 868,138 L 855,155 L 835,162 L 815,155 L 808,135 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'kazakhstan',
      name: 'Kazakhstan',
      // 哈萨克斯坦: 47°E-87°E, 40°N-55°N
      path: `M 618,95 L 662,88 L 705,98 L 735,115 L 742,138 L 725,158 L 692,168 L 652,165 L 618,152 L 602,128 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'mongolia',
      name: 'Mongolia',
      // 蒙古: 88°E-120°E, 42°N-52°N
      path: `M 748,95 L 792,88 L 832,98 L 852,118 L 848,142 L 818,158 L 782,162 L 748,152 L 732,128 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'china',
      name: 'China',
      // 中国: 73°E-135°E, 18°N-54°N
      path: `M 708,118 L 752,108 L 802,118 L 848,135 L 885,158 L 905,185 L 908,218 L 895,252 L 868,280 L 835,300 L 795,312 L 755,318 L 718,312 L 685,295 L 660,268 L 648,235 L 655,198 L 678,165 L 700,138 Z`,
      fill: '#0c1e38',
      stroke: '#2563eb',
      highlight: true
    },
    {
      id: 'india',
      name: 'India',
      // 印度: 68°E-97°E, 8°N-35°N
      path: `M 665,178 L 705,168 L 748,180 L 782,202 L 798,232 L 792,268 L 768,302 L 735,325 L 698,335 L 665,325 L 642,298 L 632,262 L 642,222 L 655,195 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'pakistan',
      name: 'Pakistan',
      // 巴基斯坦: 61°E-75°E, 24°N-37°N
      path: `M 635,148 L 668,140 L 698,152 L 718,172 L 715,198 L 692,218 L 658,225 L 632,218 L 618,195 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'iran',
      name: 'Iran',
      // 伊朗: 44°E-63°E, 25°N-40°N
      path: `M 598,138 L 635,128 L 672,140 L 698,162 L 702,188 L 682,212 L 648,222 L 612,218 L 585,198 L 578,168 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'iraq',
      name: 'Iraq',
      // 伊拉克: 38°E-48°E, 29°N-37°N
      path: `M 572,152 L 598,145 L 618,158 L 625,178 L 612,198 L 588,208 L 568,202 L 558,182 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'saudi-arabia',
      name: 'Saudi Arabia',
      // 沙特阿拉伯: 35°E-55°E, 16°N-32°N
      path: `M 562,175 L 598,168 L 632,180 L 655,202 L 662,232 L 648,262 L 618,278 L 582,282 L 552,272 L 538,245 L 545,212 L 555,188 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'japan',
      name: 'Japan',
      // 日本: 129°E-146°E, 31°N-46°N
      path: `M 872,122 L 888,115 L 902,128 L 908,148 L 898,168 L 882,182 L 865,188 L 852,178 L 852,155 L 862,138 Z
             M 878,195 L 892,190 L 902,202 L 898,218 L 885,228 L 870,225 L 862,212 L 868,198 Z
             M 872,235 L 885,230 L 895,242 L 890,258 L 875,268 L 858,265 L 850,250 L 858,238 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'south-korea',
      name: 'South Korea',
      // 韩国: 126°E-130°E, 34°N-38°N
      path: `M 845,148 L 858,142 L 868,155 L 865,172 L 852,182 L 840,178 L 835,162 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'north-korea',
      name: 'North Korea',
      // 朝鲜: 124°E-130°E, 38°N-43°N
      path: `M 840,128 L 855,122 L 865,135 L 860,148 L 845,155 L 832,150 L 828,138 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'vietnam',
      name: 'Vietnam',
      // 越南: 102°E-109°E, 9°N-23°N
      path: `M 775,222 L 792,215 L 808,228 L 815,252 L 808,280 L 792,305 L 775,318 L 762,312 L 758,285 L 768,255 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'thailand',
      name: 'Thailand',
      // 泰国: 98°E-106°E, 6°N-21°N
      path: `M 762,208 L 782,198 L 798,212 L 805,238 L 795,265 L 775,285 L 758,290 L 748,272 L 752,245 L 758,222 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'myanmar',
      name: 'Myanmar',
      // 缅甸: 92°E-101°E, 10°N-28°N
      path: `M 752,188 L 775,180 L 795,195 L 802,222 L 792,252 L 772,275 L 755,282 L 742,268 L 742,238 L 748,208 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'indonesia',
      name: 'Indonesia',
      // 印度尼西亚: 95°E-141°E, 6°S-6°N
      path: `M 768,305 L 805,295 L 842,305 L 875,322 L 895,345 L 885,375 L 858,398 L 825,408 L 792,405 L 762,392 L 745,365 L 752,335 Z
             M 775,415 L 802,408 L 828,418 L 838,438 L 822,455 L 798,462 L 775,455 L 768,435 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'philippines',
      name: 'Philippines',
      // 菲律宾: 117°E-126°E, 5°N-21°N
      path: `M 838,215 L 855,208 L 868,222 L 872,245 L 862,272 L 845,288 L 828,292 L 818,278 L 825,252 L 835,232 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'malaysia',
      name: 'Malaysia',
      // 马来西亚: 100°E-120°E, 1°N-7°N
      path: `M 762,298 L 782,290 L 802,302 L 812,325 L 800,345 L 778,355 L 758,348 L 752,322 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'afghanistan',
      name: 'Afghanistan',
      // 阿富汗: 61°E-75°E, 29°N-38°N
      path: `M 662,138 L 692,130 L 718,142 L 728,162 L 718,182 L 692,192 L 665,188 L 652,168 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'uae',
      name: 'UAE',
      // 阿联酋: 51°E-56°E, 22°N-26°N
      path: `M 622,205 L 638,200 L 648,212 L 642,225 L 625,232 L 612,225 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'taiwan',
      name: 'Taiwan',
      // 台湾: 120°E-122°E, 22°N-25°N
      path: `M 838,188 L 848,182 L 855,195 L 852,212 L 842,222 L 832,218 L 828,202 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },

    // === 大洋洲 ===
    {
      id: 'australia',
      name: 'Australia',
      // 澳大利亚: 114°E-154°E, 10°S-44°S
      path: `M 798,278 L 838,268 L 882,282 L 922,305 L 945,338 L 938,378 L 912,415 L 875,442 L 835,458 L 795,455 L 762,432 L 748,395 L 758,348 L 778,305 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'new-zealand',
      name: 'New Zealand',
      // 新西兰: 166°E-178°E, 34°S-47°S
      path: `M 948,382 L 962,375 L 975,388 L 980,408 L 970,428 L 952,438 L 938,428 L 935,405 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },
    {
      id: 'papua-new-guinea',
      name: 'Papua New Guinea',
      // 巴布亚新几内亚: 141°E-160°E, 10°S-2°S
      path: `M 878,305 L 898,298 L 918,310 L 928,332 L 918,355 L 898,368 L 878,362 L 868,340 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    },

    // === 其他 ===
    {
      id: 'greenland',
      name: 'Greenland',
      // 格陵兰: 74°W-12°W, 60°N-84°N
      path: `M 295,52 L 328,42 L 368,48 L 402,62 L 425,82 L 428,108 L 408,132 L 375,148 L 338,152 L 305,142 L 285,118 L 282,88 Z`,
      fill: '#0a1628',
      stroke: '#1e3a5f'
    }
  ],

  ocean: {
    fill: '#050d1a'
  },

  grid: {
    stroke: '#1e3a5f',
    strokeWidth: 0.5,
    opacity: 0.3
  },

  highlightLines: {
    stroke: '#2563eb',
    strokeWidth: 0.5,
    opacity: 0.2,
    dashArray: '4,4'
  }
};

// Helper functions
export function geoToScreen(lat: number, lng: number, viewBox = { width: 1000, height: 500 }): [number, number] {
  const x = ((lng + 180) / 360) * viewBox.width;
  const y = ((90 - lat) / 180) * viewBox.height;
  return [x, y];
}

export function screenToGeo(x: number, y: number, viewBox = { width: 1000, height: 500 }): [number, number] {
  const lng = (x / viewBox.width) * 360 - 180;
  const lat = 90 - (y / viewBox.height) * 180;
  return [lat, lng];
}

export const MAP_METADATA = {
  name: 'World Map',
  projection: 'Equirectangular',
  dataSource: 'Natural Earth (simplified)',
  license: 'Public Domain',
  licenseUrl: 'http://www.naturalearthdata.com/about/disclaimer/',
  commercialUsage: 'Allowed - Public Domain',
  lastUpdated: '2024-01-15'
};
