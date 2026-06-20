export type Article = {
  slug:          string;
  title:         string;
  seoTitle:      string;
  description:   string;
  category:      string;
  categorySlug:  string;
  date:          string;
  readTime:      string;
  cover:         string;
  excerpt:       string;
  keywords:      string[];
  featured?:     boolean;
};

export const CATEGORIES = [
  { slug: 'luxury-wedding-inspiration',  label: 'Luxury Wedding Inspiration' },
  { slug: 'destination-weddings',        label: 'Destination Weddings' },
  { slug: 'digital-invitations',         label: 'Digital Invitations' },
  { slug: 'wedding-planning',            label: 'Wedding Planning' },
  { slug: 'luxury-event-design',         label: 'Luxury Event Design' },
  { slug: 'wedding-website-trends',      label: 'Wedding Website Trends' },
  { slug: 'guest-experience',            label: 'Guest Experience' },
  { slug: 'venue-inspiration',           label: 'Venue Inspiration' },
];

export const ARTICLES: Article[] = [
  {
    slug:         'why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make',
    title:        'Why Your Wedding Invitation Is the Most Important Design Decision You Will Make',
    seoTitle:     'Why Your Wedding Invitation Is the Most Important Design Decision | Maison RSVP',
    description:  'Most couples spend months choosing a venue and minutes choosing an invitation. Here is why that is the wrong order — and what happens when you get it right.',
    category:     'Luxury Wedding Inspiration',
    categorySlug: 'luxury-wedding-inspiration',
    date:         '2024-11-15',
    readTime:     '6 min read',
    cover:        '/assets/editorial-3.jpg',
    featured:     true,
    keywords:     ['luxury wedding invitation', 'wedding invitation design', 'bespoke wedding invitations', 'custom wedding website', 'digital wedding invitation'],
    excerpt:      'Most couples spend months choosing a venue and minutes choosing an invitation. The venue is where the wedding happens. The invitation is where it begins. Here is why that matters more than you think.',
  },
  {
    slug:         'the-difference-between-a-wedding-website-and-a-wedding-invitation-experience',
    title:        'The Difference Between a Wedding Website and a Wedding Invitation Experience',
    seoTitle:     'Wedding Website vs. Wedding Invitation Experience | Maison RSVP',
    description:  'A wedding website tells your guests when and where. A wedding invitation experience tells them why it matters. The difference is everything.',
    category:     'Digital Invitations',
    categorySlug: 'digital-invitations',
    date:         '2024-10-28',
    readTime:     '5 min read',
    cover:        '/assets/editorial-1.jpg',
    keywords:     ['wedding website design', 'digital wedding invitation', 'luxury wedding website', 'bespoke invitation experience', 'custom wedding website Canada'],
    excerpt:      'A wedding website answers questions. A wedding invitation creates anticipation. They are not the same thing — and understanding the difference is the first step toward something extraordinary.',
  },
  {
    slug:         'lake-como-wedding-inspiration-the-most-beautiful-venues-on-the-water',
    title:        'Lake Como Wedding Inspiration: The Most Beautiful Venues on the Water',
    seoTitle:     'Lake Como Wedding Venues & Inspiration 2025 | Maison RSVP Journal',
    description:  'Lake Como remains the world\'s most sought-after destination wedding location. Here are the venues, the light, and the design language that make it extraordinary.',
    category:     'Destination Weddings',
    categorySlug: 'destination-weddings',
    date:         '2024-10-10',
    readTime:     '8 min read',
    cover:        '/assets/editorial-5.jpg',
    keywords:     ['lake como wedding', 'destination wedding Italy', 'lake como wedding venues', 'luxury wedding Italy', 'destination wedding invitation'],
    excerpt:      'There is a reason couples have been choosing Lake Como for over a century. The light is different there. The architecture is different. And the feeling — the specific feeling of being surrounded by that water and those mountains — is unlike anywhere else.',
  },
  {
    slug:         'how-to-brief-a-luxury-invitation-designer',
    title:        'How to Brief a Luxury Invitation Designer (Without Starting From Scratch)',
    seoTitle:     'How to Brief a Luxury Invitation Designer | Maison RSVP Journal',
    description:  'The best creative briefs do not describe what you want. They describe how you want your guests to feel. Here is how to write one.',
    category:     'Wedding Planning',
    categorySlug: 'wedding-planning',
    date:         '2024-09-20',
    readTime:     '5 min read',
    cover:        '/assets/editorial-6.jpg',
    keywords:     ['wedding invitation brief', 'how to brief a designer', 'luxury wedding planning', 'bespoke wedding invitation process', 'wedding designer brief'],
    excerpt:      'Most clients arrive with a mood board. The best clients arrive with a feeling. Here is the difference — and why it changes everything about what we are able to create.',
  },
  {
    slug:         'destination-wedding-digital-invitation-what-your-guests-need-to-feel-before-they-book',
    title:        'Destination Wedding Digital Invitations: What Your Guests Need to Feel Before They Book',
    seoTitle:     'Destination Wedding Digital Invitations — What Guests Need to Feel | Maison RSVP',
    description:  'When you ask guests to travel internationally for your wedding, the invitation carries a specific responsibility. Here is how to meet it.',
    category:     'Destination Weddings',
    categorySlug: 'destination-weddings',
    date:         '2024-09-05',
    readTime:     '6 min read',
    cover:        '/assets/editorial-2.jpg',
    keywords:     ['destination wedding invitation', 'digital destination wedding invite', 'international wedding guest experience', 'luxury destination wedding', 'destination wedding website'],
    excerpt:      'Asking someone to fly to another country for your wedding is a significant request. The invitation is how you tell them it is worth it — not with logistics, but with atmosphere.',
  },
  {
    slug:         '2025-luxury-wedding-website-trends',
    title:        'Luxury Wedding Website Trends for 2025: What\'s Changing and Why',
    seoTitle:     'Luxury Wedding Website Design Trends 2025 | Maison RSVP Journal',
    description:  'The templates are dying. Cinematic storytelling is rising. Here is what the most considered couples are asking for in 2025 — and why it matters.',
    category:     'Wedding Website Trends',
    categorySlug: 'wedding-website-trends',
    date:         '2024-08-18',
    readTime:     '7 min read',
    cover:        '/assets/editorial-4.jpg',
    keywords:     ['wedding website trends 2025', 'luxury wedding website design', 'digital wedding invitation trends', 'bespoke wedding website', 'wedding website design Canada'],
    excerpt:      'In 2025, the most discerning couples are moving away from templates entirely. Here is what they are choosing instead, and what it says about how our expectations for wedding design are finally maturing.',
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return ARTICLES.filter(a => a.categorySlug === categorySlug);
}
