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
    seoTitle:     'Why Your Wedding Invitation Is the Most Important Design Decision',
    description:  'Most couples spend months choosing a venue and minutes choosing an invitation. Here is why that is the wrong order — and what happens when you get it right.',
    category:     'Luxury Wedding Inspiration',
    categorySlug: 'luxury-wedding-inspiration',
    date:         '2024-11-15',
    readTime:     '6 min read',
    cover:        '/assets/journal/why-wedding-invitation-matters.webp',
    featured:     true,
    keywords:     ['luxury wedding invitation', 'wedding invitation design', 'bespoke wedding invitations', 'custom wedding website', 'digital wedding invitation'],
    excerpt:      'Most couples spend months choosing a venue and minutes choosing an invitation. The venue is where the wedding happens. The invitation is where it begins. Here is why that matters more than you think.',
  },
  {
    slug:         'the-difference-between-a-wedding-website-and-a-wedding-invitation-experience',
    title:        'The Difference Between a Wedding Website and a Wedding Invitation Experience',
    seoTitle:     'Wedding Website vs. Wedding Invitation Experience',
    description:  'A wedding website tells your guests when and where. A wedding invitation experience tells them why it matters. The difference is everything.',
    category:     'Digital Invitations',
    categorySlug: 'digital-invitations',
    date:         '2024-10-28',
    readTime:     '5 min read',
    cover:        '/assets/journal/wedding-website-vs-invitation-experience.webp',
    keywords:     ['wedding website design', 'digital wedding invitation', 'luxury wedding website', 'bespoke invitation experience', 'custom wedding website Canada'],
    excerpt:      'A wedding website answers questions. A wedding invitation creates anticipation. They are not the same thing — and understanding the difference is the first step toward something extraordinary.',
  },
  {
    slug:         'lake-como-wedding-inspiration-the-most-beautiful-venues-on-the-water',
    title:        'Lake Como Wedding Inspiration: The Most Beautiful Venues on the Water',
    seoTitle:     'Lake Como Wedding Venues & Inspiration 2026',
    description:  'Lake Como remains the world\'s most sought-after destination wedding location. Here are the venues, the light, and the design language that make it extraordinary.',
    category:     'Destination Weddings',
    categorySlug: 'destination-weddings',
    date:         '2024-10-10',
    readTime:     '8 min read',
    cover:        '/assets/journal/lake-como-wedding-venue.webp',
    keywords:     ['lake como wedding', 'destination wedding Italy', 'lake como wedding venues', 'luxury wedding Italy', 'destination wedding invitation'],
    excerpt:      'There is a reason couples have been choosing Lake Como for over a century. The light is different there. The architecture is different. And the feeling — the specific feeling of being surrounded by that water and those mountains — is unlike anywhere else.',
  },
  {
    slug:         'how-to-brief-a-luxury-invitation-designer',
    title:        'How to Brief a Luxury Invitation Designer (Without Starting From Scratch)',
    seoTitle:     'How to Brief a Luxury Invitation Designer',
    description:  'The best creative briefs do not describe what you want. They describe how you want your guests to feel. Here is how to write one.',
    category:     'Wedding Planning',
    categorySlug: 'wedding-planning',
    date:         '2024-09-20',
    readTime:     '5 min read',
    cover:        '/assets/journal/bespoke-wedding-invitation-design-process.webp',
    keywords:     ['wedding invitation brief', 'how to brief a designer', 'luxury wedding planning', 'bespoke wedding invitation process', 'wedding designer brief'],
    excerpt:      'Most clients arrive with a mood board. The best clients arrive with a feeling. Here is the difference — and why it changes everything about what we are able to create.',
  },
  {
    slug:         'destination-wedding-digital-invitation-what-your-guests-need-to-feel-before-they-book',
    title:        'Destination Wedding Digital Invitations: What Your Guests Need to Feel Before They Book',
    seoTitle:     'Destination Wedding Digital Invitations — What Guests Need to Feel',
    description:  'When you ask guests to travel internationally for your wedding, the invitation carries a specific responsibility. Here is how to meet it.',
    category:     'Destination Weddings',
    categorySlug: 'destination-weddings',
    date:         '2024-09-05',
    readTime:     '6 min read',
    cover:        '/assets/journal/destination-wedding-travel-concierge.webp',
    keywords:     ['destination wedding invitation', 'digital destination wedding invite', 'international wedding guest experience', 'luxury destination wedding', 'destination wedding website'],
    excerpt:      'Asking someone to fly to another country for your wedding is a significant request. The invitation is how you tell them it is worth it — not with logistics, but with atmosphere.',
  },
  {
    slug:         'luxury-wedding-website-trends',
    title:        'Luxury Wedding Website Design: What Sets It Apart',
    seoTitle:     'Luxury Wedding Website Design — What Sets It Apart',
    description:  'What separates a luxury wedding website from a template: editorial design, cinematic storytelling, privacy, and a bespoke guest experience — and why it matters.',
    category:     'Wedding Website Trends',
    categorySlug: 'wedding-website-trends',
    date:         '2026-06-02',
    readTime:     '7 min read',
    cover:        '/assets/journal/luxury-digital-wedding-invitation.webp',
    keywords:     ['luxury wedding website design', 'bespoke wedding website', 'high-end wedding website', 'designer wedding website', 'wedding website design Canada'],
    excerpt:      'In 2026, the most discerning couples are moving away from templates entirely. Here is what they are choosing instead, and what it says about how our expectations for wedding design are finally maturing.',
  },
  {
    slug:         'how-to-track-wedding-rsvps',
    title:        'How to Track Wedding RSVPs Without Losing Your Guest List',
    seoTitle:     'How to Track Wedding RSVPs: A Complete Guide',
    description:  'Spreadsheets break, texts get lost, and the count is never right. Here is how to track wedding RSVPs, meal choices, and dietary needs in one place — and what to do about the guests who never reply.',
    category:     'Guest Experience',
    categorySlug: 'guest-experience',
    date:         '2026-07-14',
    readTime:     '8 min read',
    cover:        '/assets/journal/wedding-rsvp-tracking-dashboard.webp',
    featured:     true,
    keywords:     ['wedding rsvp tracking', 'how to track wedding rsvps', 'online wedding rsvp', 'wedding guest list management', 'digital rsvp wedding', 'wedding rsvp deadline'],
    excerpt:      'The spreadsheet works until about guest forty. Then the plus-ones change, three people reply by text, someone answers for their whole table, and nobody knows the real number. Here is how to keep the count honest.',
  },
  {
    slug:         'wedding-qr-codes-digital-guest-book',
    title:        'Wedding QR Codes and the Digital Guest Book: A Better Way to Keep the Night',
    seoTitle:     'Wedding QR Codes & Digital Guest Books — 2026 Guide',
    description:  'The signing book gets three lines and a drawer. A QR guest book collects video, voice notes, photographs, and messages from everyone who was there. Here is how to do it without it feeling cheap.',
    category:     'Guest Experience',
    categorySlug: 'guest-experience',
    date:         '2026-07-08',
    readTime:     '7 min read',
    cover:        '/assets/journal/wedding-qr-code-digital-guest-book.webp',
    keywords:     ['wedding qr code', 'digital wedding guest book', 'qr code guest book', 'wedding guest book alternative', 'wedding qr code sign', 'digital guest book ideas'],
    excerpt:      'Most guest books collect a signature and a drawer. The people in that room have stories about you that you have never heard — and most of them will never write them down with a queue forming behind them.',
  },
  {
    slug:         'wedding-website-design-trends-2026',
    title:        'Wedding Website Design Trends 2026: What\u2019s Changing, and What\u2019s Just Noise',
    seoTitle:     'Wedding Website Design Trends 2026 \u2014 Editorial Guide',
    description:  'The wedding website design trends actually defining 2026 \u2014 editorial layouts, digital RSVP, QR check-in, privacy, and more \u2014 with real, openable examples.',
    category:     'Wedding Website Trends',
    categorySlug: 'wedding-website-trends',
    date:         '2026-07-22',
    readTime:     '11 min read',
    cover:        '/assets/journal/luxury-wedding-journal-hero.webp',
    featured:     true,
    keywords:     ['wedding website design trends 2026', 'wedding website trends 2026', 'digital wedding invitation trends 2026', 'modern wedding website examples', 'wedding website design'],
    excerpt:      'Most \u201Ctrends\u201D lists say the same five things every year. This one separates what is genuinely changing in 2026 \u2014 and what will look dated by 2027 \u2014 from a design house that builds these for a living.',
  },
  {
    slug:         'wedding-rsvp-website-guide',
    title:        'The Wedding RSVP Website Guide: Replies That Count Themselves',
    seoTitle:     'Wedding RSVP Website Guide \u2014 How It Works',
    description:  'What a wedding RSVP website should collect, how the deadline math works, and why a reply that lives inside the invitation beats a spreadsheet every time.',
    category:     'Guest Experience',
    categorySlug: 'guest-experience',
    date:         '2026-07-20',
    readTime:     '8 min read',
    cover:        '/assets/journal/online-wedding-rsvp-form-mobile.webp',
    keywords:     ['wedding rsvp website', 'online wedding rsvp', 'wedding rsvp form', 'digital rsvp wedding', 'wedding rsvp management'],
    excerpt:      'A paper reply card collects a name and a meal choice, then sits in a drawer while you rebuild the count by hand. An RSVP website collects the same thing \u2014 and keeps the count for you.',
  },
  {
    slug:         'digital-vs-printed-wedding-invitations',
    title:        'Digital vs. Printed Wedding Invitations: An Honest Comparison',
    seoTitle:     'Digital vs. Printed Wedding Invitations \u2014 Compared',
    description:  'Cost, keepsake value, guest experience, and sustainability \u2014 an honest comparison of digital and printed wedding invitations, and the hybrid most couples land on.',
    category:     'Digital Invitations',
    categorySlug: 'digital-invitations',
    date:         '2026-07-18',
    readTime:     '9 min read',
    cover:        '/assets/journal/luxury-digital-wedding-invitation.webp',
    keywords:     ['digital vs printed wedding invitations', 'digital wedding invitations', 'paper vs digital invitations', 'electronic wedding invitations', 'online wedding invitations'],
    excerpt:      'It is not really paper versus screen. It is keepsake versus function \u2014 and once you see it that way, the answer for most couples stops being either/or.',
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return ARTICLES.filter(a => a.categorySlug === categorySlug);
}
