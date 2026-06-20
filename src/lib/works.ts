export type Work = {
  slug:     string;
  title:    string;
  category: string;
  location: string;
  season:   string;
  year:     string;
  cover:    string;       // /assets/editorial-X.jpg
  images:   string[];     // additional images for the story
  tagline:  string;       // one line shown on index card
  intro:    string;       // opening paragraph on story page
  body:     string[];     // subsequent paragraphs
  details: {
    guests?:   string;
    countries?: string;
    duration?:  string;
    format?:    string;
  };
};

export const WORKS: Work[] = [
  {
    slug:     'the-crossing',
    title:    'The Crossing',
    category: 'Private Wedding',
    location: 'Lake Como, Italy',
    season:   'Summer',
    year:     '2027',
    cover:    '/assets/editorial-7.jpg',
    images:   [],
    tagline:  'An immersive story in six chapters. From a SeaBus to Lake Como.',
    intro:
      'October 14th. 7:42 AM. Vancouver. Emma boards the SeaBus. Alexander is already onboard. Neither notices the other. A delayed crossing. An empty seat. The beginning of everything.',
    body: [
      'The brief was unlike any other we had received: tell the complete story of how they met, from a commuter ferry in Vancouver to a proposal at Villa del Balbianello on Lake Como.',
      'We built six chapters, each with its own visual language, motion system, and typography. The experience opens on black. The paper reveals itself. The embossed initials emerge under shifting light.',
      'The invitation appears at the end — not as a destination, but as an arrival. The culmination of a story that was always going to end this way.',
    ],
    details: {
      guests:    '80',
      countries: '14',
      duration:  '8 months',
      format:    'Full immersive digital story + letterpress invitation',
    },
  },
  {
    slug:     'the-bellmont',
    title:    'The Bellmont',
    category: 'Private Wedding',
    location: 'Bordeaux, France',
    season:   'Autumn',
    year:     '2024',
    cover:    '/assets/editorial-1.jpg',
    images:   [
      '/assets/editorial-5.jpg',
      '/assets/editorial-6.jpg',
      '/assets/editorial-7.jpg',
    ],
    tagline:  'A wedding invitation composed as a nocturne.',
    intro:
      'The brief arrived in August: a wedding at a vineyard outside Bordeaux, in November, when the light turns amber and the stone turns cold. The couple wanted something that felt like the estate itself — ancient, quiet, certain.',
    body: [
      'We built the invitation around a single piece of film footage shot at dawn on the property. No music for the first twelve seconds. Only the sound of wind through vine rows, and then, slowly, a string quartet composed specifically for the occasion.',
      "The typographic system was built entirely in Prata and EB Garamond — no digital-native sans-serif. Every heading was set at sizes usually reserved for printed broadsheets. The colour palette was drawn directly from a photograph of the estate's limestone facade at 6am.",
      "The invitation was received in forty-two countries. Three guests flew in from Japan having seen only the digital experience. The couple's mother said she had watched it eleven times.",
    ],
    details: {
      guests:    '180',
      countries: '42',
      duration:  '3 months',
      format:    'Digital invitation + printed keepsake card',
    },
  },
  {
    slug:     'hotel-particulier',
    title:    'Hôtel Particulier',
    category: "Private Members' Club",
    location: 'Paris, France',
    season:   'Spring',
    year:     '2024',
    cover:    '/assets/editorial-2.jpg',
    images:   [
      '/assets/editorial-3.jpg',
      '/assets/editorial-4.jpg',
      '/assets/editorial-5.jpg',
    ],
    tagline:  "An annual founders' dinner for a private members' house.",
    intro:
      "A private members' club in the 7th arrondissement. An annual founders' dinner held for the past eleven years. In 2024, for the first time, the invitation would be digital.",
    body: [
      'The brief demanded absolute restraint. No animation that announced itself. No transition that called attention to its own cleverness. The invitation should feel like a well-set table — everything in its place, nothing out of order.',
      "We used silence as a design material. The opening frame held for four seconds before anything moved. The typography arrived not with a flourish but with a slow, almost reluctant certainty. The colour system was built from the club's 1920s architectural drawings: warm stone, aged brass, deep green.",
      "Three hundred guests received the invitation. The club's chairman requested that no second commission be made from this exact design. It exists once.",
    ],
    details: {
      guests:   '300',
      duration: '6 weeks',
      format:   'Digital invitation',
    },
  },
  {
    slug:     'a-golden-anniversary',
    title:    'A Golden Anniversary',
    category: 'Private Anniversary',
    location: 'Geneva, Switzerland',
    season:   'Winter',
    year:     '2023',
    cover:    '/assets/editorial-3.jpg',
    images:   [
      '/assets/editorial-6.jpg',
      '/assets/editorial-7.jpg',
      '/assets/editorial-1.jpg',
    ],
    tagline:  'A gift from a husband to his wife. Fifty years.',
    intro:
      "He called in October. His wife's birthday was in December. They had been married for fifty years and he wanted to give her something she had never seen. Something that felt like the memory of their first morning together.",
    body: [
      'We spent two weeks asking him questions. What did she smell like in 1973? What was the light like in the apartment where they first lived? What music was playing the night he proposed? Every answer became a design decision.',
      'The invitation opened with a photograph he had taken on their wedding day — scanned from a print that had sat in a drawer for decades. We built the typographic system around her handwriting, which he sent us on a single sheet of cream notepaper.',
      'She has never stopped speaking about it. He sent us a letter — a real letter, handwritten — two weeks after her birthday. It said only: "She watched it with me three times. Then she watched it alone, six more."',
    ],
    details: {
      guests:  '60',
      duration: '8 weeks',
      format:  'Private digital experience + archival print',
    },
  },
  {
    slug:     'the-kyoto-gathering',
    title:    'The Kyoto Gathering',
    category: 'Cultural Evening',
    location: 'Kyoto, Japan',
    season:   'Spring',
    year:     '2023',
    cover:    '/assets/editorial-4.jpg',
    images:   [
      '/assets/editorial-2.jpg',
      '/assets/editorial-5.jpg',
      '/assets/editorial-6.jpg',
    ],
    tagline:  'A cultural evening composed around a single evening of silence.',
    intro:
      "An intimate gathering of forty guests at a private residence in Kyoto's Higashiyama district. An evening of ikebana, poetry, and a private performance. The invitation had to carry the weight of the occasion without explaining it.",
    body: [
      'We chose to build the entire invitation around negative space. Where most digital experiences fill every moment, this one insisted on emptiness. Long holds. Slow fades. Typography that arrived like a thought rather than an announcement.',
      'The video footage was shot at dawn in a bamboo grove thirty minutes outside the city. We used a single held note — a shakuhachi — as the only sound. Nothing else for forty seconds.',
      'Every guest arrived having already felt the atmosphere of the evening. The host said it was the most prepared and present group of guests she had ever welcomed.',
    ],
    details: {
      guests:  '40',
      duration: '5 weeks',
      format:  'Private digital invitation',
    },
  },
  {
    slug:     'maison-de-couture',
    title:    'Maison de Couture',
    category: 'Brand Moment',
    location: 'Milan, Italy',
    season:   'Autumn',
    year:     '2023',
    cover:    '/assets/editorial-5.jpg',
    images:   [
      '/assets/editorial-7.jpg',
      '/assets/editorial-1.jpg',
      '/assets/editorial-3.jpg',
    ],
    tagline:  'A private presentation for a house that does not advertise.',
    intro:
      'A Milanese couture house. A private presentation for sixty clients and press. The house had never used a digital invitation before. They had specific conditions: it must feel like the house. It must not feel like technology.',
    body: [
      "The house's creative director sent us three reference images: a bolt of raw silk, a detail from a 1967 Balenciaga archive photograph, and a sketch from the current collection. That was the entire brief.",
      'We built the invitation around the weight and texture of fabric. The motion system was designed to feel like cloth — no mechanical easing, no spring physics. Everything moved with the slow, inevitable quality of heavy silk falling.',
      'The invitation was shared with sixty recipients. Forty-three attended. The creative director sent a single message afterwards: "It was correct."',
    ],
    details: {
      guests:  '60',
      duration: '10 weeks',
      format:  'Digital invitation + archive print',
    },
  },
  {
    slug:     'the-blackwood-centenary',
    title:    'The Blackwood Centenary',
    category: 'Legacy Event',
    location: 'Edinburgh, Scotland',
    season:   'Summer',
    year:     '2023',
    cover:    '/assets/editorial-6.jpg',
    images:   [
      '/assets/editorial-4.jpg',
      '/assets/editorial-2.jpg',
      '/assets/editorial-7.jpg',
    ],
    tagline:  'One hundred years of a family. One evening to hold it.',
    intro:
      'The Blackwood family has gathered every summer since 1923. In 2023, the centenary. The eldest daughter commissioned an invitation that would be sent to family members across twelve countries — many of whom had never met.',
    body: [
      'The research phase lasted four weeks. We spoke with seven family members across four generations. We were given access to a hundred years of photographs, letters, and documents. The invitation had to hold all of that without collapsing under its own weight.',
      'We built it as an archive that breathed. Photographs emerged slowly, as if being developed. Text appeared as if being read for the first time. The whole experience took eleven minutes to move through — and every person we tested it with said it felt shorter.',
      'One hundred and twenty family members gathered in Edinburgh. The youngest was eight months old. The eldest was ninety-four. Every one of them had watched the invitation. Two had watched it together, on opposite sides of the world, on a video call.',
    ],
    details: {
      guests:    '120',
      countries: '12',
      duration:  '12 weeks',
      format:    'Digital invitation + bound archive book',
    },
  },
  {
    slug:     'emma-and-alexander',
    title:    'Emma & Alexander',
    category: 'Private Wedding',
    location: 'Lake Como, Italy',
    season:   'Summer',
    year:     '2027',
    cover:    '/assets/ea-vancouver.jpg',
    images:   [
      '/assets/ea-ticket.jpg',
      '/assets/ea-letter.jpg',
      '/assets/ea-portrait.jpg',
    ],
    tagline:  'Some stories begin with a destination. Ours began with a crossing.',
    intro:
      "It began on a SeaBus. Vancouver. October 14th, 7:42 AM. A delayed crossing, an empty seat, a conversation that was never supposed to happen. Three years later, Lake Como.",
    body: [
      "Emma was reading. Alexander was watching the water. Neither noticed the other until the crossing was delayed and the only empty seat was beside her.",
      "What followed was not a love story in any conventional sense. It was slower than that. More uncertain. More real.",
      "We were asked to tell it from the beginning — from the ticket stub he kept in his journal, to the letters she wrote and never sent, to the evening in Como when everything finally became clear.",
    ],
    details: {
      guests:    '80',
      countries: '12',
      duration:  '6 months',
      format:    'Full digital story experience + printed archive',
    },
  },
];

export function getWork(slug: string): Work | undefined {
  return WORKS.find(w => w.slug === slug);
}
