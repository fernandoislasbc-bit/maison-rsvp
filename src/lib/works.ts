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
  /** URL of the live invitation experience (internal or external). When set,
      the story page shows an "Enter Invitation" button linking to it. */
  experienceUrl?: string;
};

export const WORKS: Work[] = [
  {
    slug:     'oliver-and-charlotte',
    title:    'Oliver & Charlotte',
    category: 'Private Wedding',
    location: 'Vaughan, Canada',
    season:   'Autumn',
    year:     '2027',
    cover:    '/assets/oc/oc-proposal-cover.png',
    images:   ['/assets/oc/couple.png'],
    tagline:  'The Secret Garden of Toronto. Botanical romance at The Arlington Estate, painted in blush, sage, and gold.',
    intro:
      'Oliver Bennett and Charlotte Sinclair wanted their invitation to feel like stepping into a secret garden — an English botanical dream transplanted to The Arlington Estate in Vaughan, Ontario.',
    body: [
      'The brief called for softness: blush petals, sage leaves, warm golds — a palette drawn from the estate gardens in September light.',
      'The experience unfolds like a garden walk. Botanical illustrations bloom as the guest scrolls, the venue reveals itself through layered parallax, and the couple\'s story is told in hand-set serif type between the flowers.',
      'The RSVP arrives at the end of the path — a quiet clearing after the garden, where guests leave their reply among the petals.',
    ],
    details: {
      guests:   '150',
      duration: '3 months',
      format:   'Full cinematic digital invitation + RSVP',
    },
    experienceUrl: '/experiences/oliver-and-charlotte/index.html',
  },
  {
    slug:     'thomas-and-grace',
    title:    'Thomas & Grace',
    category: 'Private Wedding',
    location: 'Côte d\'Azur, France',
    season:   'Summer',
    year:     '2027',
    cover:    '/assets/tg/tg-couple.png',
    images:   [
      '/assets/tg/tg-proposal.png',
      '/assets/tg/tg-vineyard.png',
      '/assets/tg/tg-birds.png',
    ],
    tagline:  'Cobalt florals, lemon groves, hummingbirds in flight — a Mediterranean toile de Jouy invitation.',
    intro:
      'Thomas and Grace wanted their invitation to feel like a piece of Delft porcelain come to life — cobalt blue botanical illustrations, lemons heavy with summer, and hummingbirds in perpetual flight across a cream canvas.',
    body: [
      'The visual world was drawn from the toile de Jouy tradition — a style born in the French countryside for rendering pastoral scenes in a single ink colour on ivory ground. We translated it into motion.',
      'The experience opens on a garden of animated birds. Guests enter through a veil of cobalt hummingbirds that part to reveal the invitation — their names in script, the date in Roman numerals, and a vineyard table set for a summer night.',
      'An animated "Save the Date" plays as a cinematic moment. The proposal scene, painted in blue and gold, carries their story. The editorial couple portrait — sunglasses, wedding rings forward — announces their personality.',
    ],
    details: {
      guests:    '120',
      countries: '9',
      duration:  '4 months',
      format:    'Full immersive digital invitation + animated save the date + RSVP',
    },
    experienceUrl: '/work/thomas-and-grace',
  },
  {
    slug:     'oliver-and-daniela',
    title:    'Oliver & Daniella',
    category: 'Private Wedding',
    location: 'Kelowna, Canada',
    season:   'Summer',
    year:     '2026',
    cover:    '/assets/od/od-proposal.png',
    images:   ['/assets/od/od-proposal.png', '/assets/od/od-greenhouse.png', '/assets/od/od-couple.png'],
    tagline:  'An embossed tropical garden. Blush palms, rose parrots in flight, and a Positano proposal carved in ivory and rose quartz.',
    intro:
      'Oliver and Daniella wanted their invitation to feel like holding a carved relief — an embossed world of blush palms, tropical birds, and a crescent moon suspended in a garden of roses.',
    body: [
      'The entire visual language was built from a single aesthetic: the three-dimensional embossed bas-relief. Every image feels sculpted — as if pressed from soft plaster or ivory — with botanical palms, parrots, hibiscus, and dates rendered in tones of blush, rose, mauve, and sage.',
      'The experience opens on a cinematic video entrance. Guests arrive through motion and stillness, then step into a world where rose petals fall across every chapter. The proposal — on a Positano balcony at golden hour — is rendered in the same embossed style, all cream and lavender and candlelight.',
      'The venue: a glass greenhouse draped in climbing roses in Kelowna. The RSVP opens against an ambient video of the botanical world in motion. The invitation card itself is the embossed frame — palm trees, birds, a crescent moon — waiting for the guests\' names in its centre.',
    ],
    details: {
      guests:    '80',
      countries: '5',
      duration:  '3 months',
      format:    'Full immersive digital invitation + RSVP',
    },
    experienceUrl: '/work/oliver-and-daniela',
  },
  {
    slug:     'neil-and-riley',
    title:    'Neil & Riley',
    category: 'Private Wedding',
    location: 'Vancouver, Canada',
    season:   'Autumn',
    year:     '2026',
    cover:    '/assets/nr/newspaper-invitation.png',
    images:   [],
    tagline:  'A cinematic heirloom invitation. Burgundy velvet, a letter that opens, and a story told in gold.',
    intro:
      'Neil and Riley asked for something that felt like receiving a physical luxury invitation — but in digital form. The experience opens with a cinematic video of an envelope being opened, dissolving into a full immersive story.',
    body: [
      'The brief was deceptively simple: make it feel like an object, not a website. An envelope. A letter. Something that a guest receives, holds, and opens.',
      'We built the entire experience around the moment of opening — a full-screen cinematic video of a burgundy velvet envelope, a gloved hand holding an ivory box stamped "you are invited," and a newspaper-style invitation that reveals itself on scroll.',
      'Gold sparkle particles drift across every video section, activated by scroll. The ring photographs animate in from opposite sides of the screen and float past each other on parallax as the guest scrolls. The RSVP section is called "Your Reply Is Awaited."',
    ],
    details: {
      guests:    '120',
      countries: '8',
      duration:  '4 months',
      format:    'Full cinematic digital invitation + RSVP',
    },
  },
  {
    slug:     'santiago-and-luna',
    title:    'Santiago & Luna',
    category: 'Private Wedding',
    location: 'Tulum, Mexico',
    season:   'Winter',
    year:     '2027',
    cover:    '/assets/sl/sl-la-ceremonia.png',
    images:   [],
    tagline:  'A luxury Mexican heirloom. A scratch-revealed love story, four chapters, one celebration.',
    intro:
      'They met in a classroom. A warm afternoon, somewhere in Mexico, long before either of them understood what they had found. Years later, a question on the Tulum coastline changed everything.',
    body: [
      'The brief asked for something that had never existed before in our studio: a digital heirloom, not a wedding website. The experience opens on a scratch-reveal interaction — guests uncover a hand-rendered talavera motif beneath their own touch before the story begins.',
      'Four chapters carry the couple from their first glance to their wedding day, each with its own palette drawn from Mexican craft traditions — warm terracotta, deep emerald, aged gold, talavera blue — never tourist, never cliché.',
      'The RSVP was renamed "Your Reply Is Awaited," and a Memory Vault invites guests to leave photographs, voice messages, and written notes — becoming part of the archive rather than simply attending it.',
    ],
    details: {
      guests:    '120',
      countries: '9',
      duration:  '5 months',
      format:    'Full immersive digital heirloom + scratch-reveal opening',
    },
  },
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
    title:    'Emma & Emmanuel',
    category: 'Private Wedding',
    location: 'Umbria, Italy',
    season:   'Summer',
    year:     '2027',
    cover:    '/assets/ee/ea-hero.png',
    images:   [
      '/assets/ee/ea-envelope-portrait.png',
      '/assets/ee/ea-venue.png',
      '/assets/ee/ea-map.png',
    ],
    tagline:  'An invitation sealed in wax. A letter that arrived before the day.',
    intro:
      "The envelope arrives before anything else does. Before the journey, before the vows, before the first glass of wine on a Umbrian terrace. This is where the story begins — with a seal, and the decision to break it.",
    body: [
      "Emma and Emmanuel asked for something that felt like receiving a handwritten letter from another century — the weight of cream paper, the warmth of candlelight, the intimacy of a wax seal pressed with intention.",
      "We built the experience around the moment of opening. A forest green envelope. A seal bearing their initials. The flap lifts slowly, deliberately, and from within it rises a letter — their story, written in the language of love and place.",
      "The invitation unfolds across seven chapters: the letter, their story told in polaroids, the Umbrian villa at dusk, the programme of the day, and an RSVP that feels like writing back to an old friend. The falling petals loop in the background throughout — gentle, ancient, inevitable.",
    ],
    details: {
      guests:    '90',
      countries: '11',
      duration:  '4 months',
      format:    'Full immersive digital invitation + wax seal entrance + RSVP',
    },
  },
];

export function getWork(slug: string): Work | undefined {
  return WORKS.find(w => w.slug === slug);
}
