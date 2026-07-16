import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { getArticle, ARTICLES } from '@/lib/journal';
import { buildMetadata, articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title:       article.seoTitle,
    description: article.description,
    path:        `/journal/${article.slug}`,
    keywords:    article.keywords,
  });
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

/* Article body content — in production this would come from a CMS.
   Prose supports inline internal links with a [label](/path) shorthand,
   rendered by <RichText> below; each section may carry one image. */
type ArticleSection = {
  heading: string;
  body: string;
  image?: { src: string; alt: string; caption?: string };
};

function getArticleBody(slug: string): { intro: string; sections: ArticleSection[]; pullQuote: string; faqs: { q: string; a: string }[] } {
  const bodies: Record<string, ReturnType<typeof getArticleBody>> = {
    'why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make': {
      intro: `Most couples spend months agonising over the venue, the flowers, the menu, the dress. These decisions take weeks, sometimes months, of deliberation. The invitation, by contrast, is often treated as a formality — something to be checked off the list in an afternoon.

This is the wrong order. Not because the venue doesn't matter, but because the invitation is doing something the venue never can: it is the first moment your guests experience what your wedding will feel like.`,
      sections: [
        {
          heading: 'The invitation is not a logistics document',
          body: `When a guest receives an invitation, they are not looking for information. They already know roughly when and where the wedding will happen. What they are looking for — consciously or not — is an emotional signal. They are asking: what kind of experience is this going to be? How should I feel about being here?

The invitation answers that question before a single arrangement has been placed or a single note of music has been played. It is the first impression. And in luxury design, as in all design, first impressions are the hardest things to correct once they have been made. This is precisely [what separates an invitation from a wedding website](/journal/the-difference-between-a-wedding-website-and-a-wedding-invitation-experience): one creates a feeling, the other answers a question.`,
          image: {
            src: '/assets/journal/wax-seal-digital-wedding-invitation.webp',
            alt: 'A wax-sealed luxury digital wedding invitation opening on a mobile phone',
            caption: 'The moment of opening carries more weight than any detail that follows it.',
          },
        },
        {
          heading: 'What a great invitation does',
          body: `A great invitation does not describe your wedding. It creates anticipation for it. It makes your guests feel something specific — not just excitement (which is generic) but the particular quality of excitement that belongs to your event.

A garden wedding in Provence should feel different from a city celebration in a private members' club in Tokyo. Both might be equally beautiful. But they should feel different from the first moment a guest encounters them — and that difference begins with the invitation. It matters even more when you are [asking guests to travel](/journal/destination-wedding-digital-invitation-what-your-guests-need-to-feel-before-they-book), because then the invitation is also making a case.`,
        },
        {
          heading: 'The luxury standard',
          body: `In every other area of the luxury experience — hospitality, fashion, jewellery, gastronomy — the packaging and the approach are considered as carefully as the object or service itself. A hotel that charges four figures per night does not send guests a generic confirmation email. A jeweller does not wrap a significant piece in a paper bag.

The luxury wedding invitation should be held to the same standard. Not because of what it costs, but because of what it communicates. The invitation is where the event begins.

If you are considering something composed rather than chosen, our [collections and what each includes](/collection) is the honest place to start — and [the commissions we have built](/work) will tell you more than any description can. When you are ready to talk to a studio, [how you brief them](/journal/how-to-brief-a-luxury-invitation-designer) will shape the result more than any budget line.`,
        },
      ],
      pullQuote: 'The venue is where the wedding happens. The invitation is where it begins. These are not the same moment.',
      faqs: [
        {
          q: 'What is a bespoke digital wedding invitation?',
          a: 'A bespoke digital wedding invitation is a custom-designed digital experience — not a template — that tells the story of a couple and creates genuine anticipation for their event. Unlike a standard wedding website, a bespoke invitation is designed from scratch around the specific aesthetic and narrative of the occasion.',
        },
        {
          q: 'How early should we commission our wedding invitation?',
          a: 'For a Maison RSVP commission, we recommend beginning the process at least three to four months before you plan to send your invitations. Our Signature and Maison collections require six to sixteen weeks of design and development time, and we accept a limited number of commissions each season.',
        },
        {
          q: 'Is a digital invitation appropriate for a formal luxury wedding?',
          a: 'Yes. The formality of an occasion is conveyed by the quality and craft of the invitation, not its medium. A bespoke digital invitation designed with the same care and intentionality as a letterpress paper suite communicates the same level of sophistication — and offers storytelling dimensions that paper cannot.',
        },
      ],
    },
    'the-difference-between-a-wedding-website-and-a-wedding-invitation-experience': {
      intro: `There is a common misconception in wedding planning: that a wedding website and a wedding invitation are the same thing, or that one can substitute for the other. They cannot. They are doing fundamentally different work.

Understanding the difference is not an academic exercise. It is the difference between guests who arrive at your wedding curious and expectant, and guests who arrive having simply confirmed logistics.`,
      sections: [
        {
          heading: 'What a wedding website does',
          body: `A wedding website is an information system. It answers the practical questions that guests have: When is it? Where is it? What should I wear? Where should I stay? How do I RSVP? Those questions genuinely matter — and answering them badly creates real work for you, which is why [how you collect and track those replies](/journal/how-to-track-wedding-rsvps) deserves its own thought.

These are important questions. They deserve clear, well-designed answers. A good wedding website does this beautifully, with care. But answering questions is not the same thing as creating desire. It is not the same as making someone feel something.`,
        },
        {
          heading: 'What a wedding invitation experience does',
          body: `A wedding invitation experience begins before the information. It begins with atmosphere — with the specific quality of light, sound, movement, and mood that defines your event. It tells guests not just where to go, but what to feel about going there. This is [the most consequential design decision most couples rush](/journal/why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make).

This is the work of a narrative designer, not just a web designer. It requires understanding the story of a couple — how they met, what draws them together, what the place they have chosen means to them — and translating that into a digital experience that a guest encounters for the first time and immediately understands, emotionally, what kind of occasion this will be.`,
        },
        {
          heading: 'Why both matter',
          body: `The most considered couples do not choose between an invitation experience and a wedding website. They understand that these serve different purposes in the guest journey — and [the way that expectation is shifting](/journal/luxury-wedding-website-trends) is the clearest signal of where wedding design is going. If you would like to see how the two live inside one link — invitation, replies, and the guest hub together — you can [walk through a real one yourself](/nr/demo).

The invitation experience is sent to guests before the save-the-date, or alongside it. It is the opening statement — the emotional declaration that this is going to be extraordinary. The wedding website handles the logistics: accommodation, directions, dietary requirements, the schedule.

One creates desire. The other fulfils the practical requirements that desire creates. Both are necessary. But they are not interchangeable.`,
        },
      ],
      pullQuote: 'A wedding website answers questions. A wedding invitation creates anticipation. They are not the same thing.',
      faqs: [
        {
          q: 'Do I need both a wedding website and a digital invitation?',
          a: 'Not necessarily. At Maison RSVP, our Signature and Maison commissions include full information architecture — including RSVP functionality, accommodation details, and schedule — within the invitation experience itself. We design them as a single, unified guest journey rather than two separate products.',
        },
        {
          q: 'Can a digital invitation include RSVP functionality?',
          a: 'Yes. All Maison RSVP commissions include bespoke RSVP experiences designed to feel as considered as the invitation itself — not a standard form, but an interaction that belongs to the aesthetic and narrative of the event.',
        },
      ],
    },
    'how-to-track-wedding-rsvps': {
      intro: `The spreadsheet works until about guest forty. Then a plus-one changes, three people reply by text, someone answers on behalf of their whole table, an aunt calls your mother instead of you, and the number in cell B2 stops meaning anything.

This is the least glamorous part of a wedding and the one that quietly eats the most hours. It does not have to. What follows is how to track wedding RSVPs so the count stays honest — and what to do about the third of your guest list who will simply never reply.`,
      sections: [
        {
          heading: 'Why the spreadsheet always breaks',
          body: `A spreadsheet assumes replies arrive in one format, through one channel, from one person per household. Real replies do not. They arrive as texts, emails, Instagram messages, voicemails to your parents, and remarks at dinner that everyone forgets by morning.

The problem is not that you are disorganised. The problem is that you are the integration layer between six channels, and no one can do that job for two hundred people while also getting married.

The fix is structural rather than heroic: give every guest exactly one place to answer, and let their answer write itself into your count. When [the reply lives inside the invitation itself](/journal/the-difference-between-a-wedding-website-and-a-wedding-invitation-experience), there is no transcription step where things get lost.`,
          image: {
            src: '/assets/journal/online-wedding-rsvp-form-mobile.webp',
            alt: 'An online wedding RSVP form on a mobile phone showing attendance, party size and meal selection',
            caption: 'One reply, one place, one format — the guest sees a question, you receive structured data.',
          },
        },
        {
          heading: 'What you actually need to collect',
          body: `Most couples collect too little and then spend weeks chasing the rest. Ask for everything in the same breath as the yes:

Who is coming, and exactly how many seats. Not "the Rossis" — four seats, named. Meal selection per person, not per party, because caterers count plates rather than families. Dietary requirements and allergies, in the guest's own words. And a way to reach that guest directly, so the follow-up does not go through three relatives.

Everything you fail to ask now becomes a second round of messages later, and second rounds have far worse response rates than the first.

If you are composing the invitation itself, [our free invitation maker](/invitation-maker) collects the reply for you and sends it straight to your inbox — no spreadsheet in the middle.`,
        },
        {
          heading: 'The chase: guests who never reply',
          body: `Assume a third of your list will not answer the first ask. This is not rudeness; the invitation arrived during someone's commute and the moment passed.

Set your RSVP deadline three to four weeks before the caterer's final count, not on it. That gap is where the chase lives, and you will need it. Then make the follow-up specific rather than general — a note to one household outperforms an announcement to everyone, because a group message is nobody's responsibility.

What helps most is simply being able to see, at a glance, who has not replied. Not scrolling a sheet: a list that already knows. That is the entire argument for [a dashboard that keeps its own count](/nr/demo) — it turns "who is missing?" from an evening of cross-referencing into a question you answer in four seconds.`,
          image: {
            src: '/assets/journal/wedding-rsvp-tracking-dashboard.webp',
            alt: 'A wedding RSVP tracking dashboard showing attending, declined and pending guest counts with meal selections',
            caption: 'Attending, declined, pending, and the meal breakdown your caterer will ask for — updating as guests reply.',
          },
        },
        {
          heading: 'Meal selections and dietary needs are not a footnote',
          body: `Your caterer will ask for three numbers and one list: how many of each dish, and who cannot eat what. If your RSVP collected meals per party rather than per person, you will rebuild that data by hand at the worst possible moment.

Collect the meal against the seat from the beginning. Ask about dietary needs in an open field rather than a checkbox, because "gluten-free, and my mother cannot have shellfish" does not fit in a checkbox, and that sentence is exactly what the kitchen needs to read.

Then make sure you can export the whole thing. Your caterer, your planner, and your venue each want it in their own format, and none of them want your login.`,
        },
        {
          heading: 'The last mile: the door',
          body: `The count matters most on the one night it becomes physical. Someone at the entrance has a list, a phone torch, and a queue — and the difference between a graceful arrival and a bottleneck is whether that person can find a name in two seconds.

This is where a digital RSVP earns its keep twice: the same reply that fed your count can issue that guest a pass, so arrival is a scan rather than a search. It also means you know who actually walked in, which is a different number from who said yes — and the only number that matters at midnight when you are looking for someone. The same code on the table can also [collect what your guests want to say to you](/journal/wedding-qr-codes-digital-guest-book) once they are seated.

If you would like to see the whole path end to end — reply, pass, door — you can [walk through a live one in about two minutes](/nr/demo), scanning a real pass with your own phone.`,
          image: {
            src: '/assets/journal/wedding-guest-hub-event-details.webp',
            alt: 'A wedding guest hub on a phone showing event details, timing and venue information',
            caption: 'Everything the guest needs, in the same place they replied — so they stop asking you.',
          },
        },
      ],
      pullQuote: 'You are not disorganised. You are being asked to be the integration layer between six channels for two hundred people, while also getting married.',
      faqs: [
        {
          q: 'When should wedding RSVPs be due?',
          a: 'Set your RSVP deadline three to four weeks before your caterer and venue need the final count — not on the same day. That gap is where you chase the third of your guest list who will not reply the first time. For destination weddings, move the deadline earlier still: guests are booking flights, so aim for two to three months before the date.',
        },
        {
          q: 'What do you do about guests who never RSVP?',
          a: 'Assume roughly a third will not answer the first ask. Follow up per household rather than by group message — a note addressed to one couple gets answered, an announcement to everyone is nobody’s responsibility. After two attempts, call. If you still have no answer a week before the count is due, mark them as not attending and tell them that is what you have done; it usually produces an immediate reply.',
        },
        {
          q: 'Is an online RSVP better than a paper reply card?',
          a: 'For anything above about fifty guests, yes — not because paper is worse, but because paper does not count itself. An online reply arrives already structured: seats, meals, dietary needs, all attached to the right guest. The most considered couples do both: a physical card for the ceremony of it, and a digital reply for the count.',
        },
        {
          q: 'How do you handle plus-ones without insulting anyone?',
          a: 'Decide the number of seats per invitation before you send anything, and let the invitation itself carry that number. When a guest opens theirs and it says two seats, the question never arises. Ambiguity is what creates the awkward conversation, not the limit.',
        },
      ],
    },
    'wedding-qr-codes-digital-guest-book': {
      intro: `The signing book collects a signature, a first name, and occasionally "so happy for you both!" from someone who queued behind four other people and could not think of anything under pressure. Then it goes in a drawer.

The people in that room have stories about you that you have never heard. Your grandmother has a sentence she has been saving. Your oldest friend has a version of the night you met that you have never been told. None of that fits on a line, standing up, with a pen that has stopped working.`,
      sections: [
        {
          heading: 'What a QR guest book actually is',
          body: `It is a card on the table with a code on it. A guest points their phone at it and, instead of a form, they get a choice: record a video, leave a voice note, upload a photograph, or write something.

That is the entire mechanism. No app, no account, no download — which matters, because every additional step costs you roughly half your participants. A guest who is three glasses in and genuinely moved will do one thing on their phone. They will not do four.

The reason it works is not novelty. It is that speaking is easier than writing, and a phone is already in their hand.`,
          image: {
            src: '/assets/journal/wedding-qr-code-digital-guest-book.webp',
            alt: 'A wedding QR code card reading Leave a Memory beside a phone showing options to record video, voice or photos',
            caption: 'A card, a code, and four ways to answer — chosen by the guest, not imposed on them.',
          },
        },
        {
          heading: 'What guests leave when you make it easy',
          body: `Something interesting happens when you remove the queue and the pen. People stop performing and start talking.

The voice notes are the ones couples replay. A written line is composed; a voice note is your uncle at 11pm, laughing halfway through, giving up on the toast he prepared and saying the true thing instead. The videos are shaky and badly lit and irreplaceable. The photographs are the ones your photographer could never have taken, because they were shot from inside the table rather than beside it.

You will also receive things from people who were not there. The friend who could not fly in, the grandparent who could not travel — a link reaches them too, and their absence turns into a contribution instead of a gap.

It works best when it lives beside the reply rather than apart from it: the guest who already [answered your invitation in one place](/journal/how-to-track-wedding-rsvps) does not need to learn a second system on the night.`,
        },
        {
          heading: 'Where the code should live',
          body: `Placement decides participation. A single sign by the entrance gets scanned by the people who arrive early and sober, and then forgotten.

Put it where people are already sitting and already sentimental: on the tables, during dinner, between courses. On the back of the menu. On a card at each place setting rather than one per table, because a card that belongs to someone gets used and a card that belongs to everyone gets ignored.

And ask for it out loud, once, from the microphone. Thirty seconds during the toasts will outperform every printed sign in the room.`,
        },
        {
          heading: 'The archive is the point',
          body: `The morning after, all of it should be in one place — not scattered across a hashtag, a shared album, three group chats, and a phone that is about to run out of storage.

This is the part couples underestimate. What you are building is not a guest book; it is the only record of the night made by the people who were in it, from angles no professional could occupy. It should arrive as an archive you can actually revisit: sorted, kept, and yours — not a folder of files named IMG_4471.

And you should decide what enters it. Not everything a wedding produces at midnight deserves permanence.`,
          image: {
            src: '/assets/journal/wedding-memory-capsule-archive.webp',
            alt: 'A private wedding memory archive showing guest videos, voice notes, photographs and written messages',
            caption: 'Everything guests left, gathered into one private archive after the night rather than scattered across phones.',
          },
        },
        {
          heading: 'How to keep it from feeling cheap',
          body: `The reason QR codes have a reputation is that most of them were printed in a hurry and taped to something. A black square on white copy paper next to your florals is a defeat.

Three things fix it. Give the code the same design attention as your stationery — the card it sits on is stationery, and it should be printed on the same stock as everything else on that table. Write the invitation to scan in your own voice, not the software's: "leave a memory" rather than "scan here". And make sure what opens on the other side looks like your wedding rather than like a form — because the two seconds after the scan are where the illusion either holds or collapses.

Done properly, nobody at the table thinks about technology at all. They think about what they want to say. That is [the same standard the invitation itself is held to](/journal/why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make), and it applies to every object your guests touch.

If it helps to see one working, the [live demonstration](/nr/demo) includes the memories page exactly as a guest receives it — you can leave something yourself and watch it arrive for approval.`,
        },
      ],
      pullQuote: 'A written line is composed. A voice note is your uncle at 11pm, giving up on the toast he prepared and saying the true thing instead.',
      faqs: [
        {
          q: 'How does a QR code guest book work at a wedding?',
          a: 'A card on each table carries a code. Guests point a phone camera at it and immediately get the choice to record a video, leave a voice note, upload photographs, or write a message — with no app to download and no account to create. Everything they leave goes privately to the couple, who decide what joins the final archive.',
        },
        {
          q: 'Is a digital guest book better than a traditional one?',
          a: 'It collects a different thing. A traditional book collects signatures and short lines written standing up in a queue. A digital guest book collects voices, faces, and photographs taken from inside the celebration. Many couples keep both — the book for the ritual of signing, the QR for what people actually want to say.',
        },
        {
          q: 'Where should you put QR codes at a wedding?',
          a: 'On the tables during dinner, ideally one card per place setting rather than one per table — a card that belongs to someone gets used. Entrance signage alone underperforms, because guests arriving are focused on finding their seat. The single biggest improvement is asking for it once, out loud, during the toasts.',
        },
        {
          q: 'Do guests need to download an app to leave a memory?',
          a: 'They should not, and if they do, you will lose most of them. Every extra step roughly halves participation. A well-built memories page opens straight from the camera in the phone’s browser and lets a guest record and send in under a minute.',
        },
      ],
    },
    'lake-como-wedding-inspiration-the-most-beautiful-venues-on-the-water': {
      intro: `There is a reason couples have been choosing Lake Como for over a century, and it is not the villas. It is the light.

Como sits in a glacial trench with mountains on both sides, which means the sun arrives late, leaves early, and spends the hours in between bouncing off water and back onto stone. Everything photographed there looks slightly lit from below. No planner arranged that, and no venue can sell it to you — it is simply the condition of the place.`,
      sections: [
        {
          heading: 'The villas, honestly assessed',
          body: `Villa del Balbianello is the one everyone knows: the loggia on the promontory, the terraced steps, the view that has been in films. It is genuinely extraordinary and it is genuinely difficult — access is by boat, the ceremony window is tightly controlled, and you are sharing the site with day visitors until they close.

Villa Erba offers scale that Balbianello cannot: it can hold a large guest list without the day feeling like a logistics exercise. Villa Pizzo gives you gardens that run down to the water and considerably more privacy than its neighbours. Villa Sola Cabiati is smaller, and for an intimate list it is arguably the most romantic of all of them.

The honest advice: choose for the number of people you actually love rather than the photograph you have seen. Balbianello with 150 guests is a beautiful, stressful day. Sola Cabiati with 40 is a wedding.`,
          image: {
            src: '/assets/journal/lake-como-wedding-venue.webp',
            alt: 'A luxury Lake Como wedding venue on the water with mountains and terraced gardens',
            caption: 'The light at Como arrives off the water — which is why everything shot there looks lit from below.',
          },
        },
        {
          heading: 'The season decides more than the venue',
          body: `May and September are what everyone wants, and they are right to want them. June through August the lake is hot, crowded, and the transfer times double because the roads along the water are single-lane and full of tourists.

Late September is the quiet secret: the light gets longer and warmer, the crowds thin, and the water still holds summer's heat. October is beautiful and a genuine gamble.

Whatever you choose, book eighteen months out. The good villas on the good dates are not competitive — they are simply gone. Once the date is yours, [the invitation has months of work to do](/collection) before anyone books a flight.`,
        },
        {
          heading: 'The design language of the lake',
          body: `Como has a specific palette and it punishes couples who ignore it. The place is already saturated: ochre stone, dark cypress, that particular blue-green water, wrought iron, faded terracotta. If you bring in a strong colour story of your own, you are fighting the backdrop and the backdrop always wins.

The couples who get it right work with a restrained palette — ivory, stone, olive, a touch of citrus — and let the lake supply the drama. The same discipline applies to the invitation: [the design should carry the atmosphere of the place](/journal/why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make) rather than compete with it. You can see how that plays out across [the commissions we have built](/work).`,
        },
        {
          heading: 'What you are really asking of your guests',
          body: `A Lake Como wedding is not an invitation to a wedding. It is an invitation to fly to Milan, drive an hour, book three nights, and rearrange a week of their lives.

That is a significant request, and it changes what the invitation has to do. It has to make the case before it asks for the reply — which is a different job from telling people a date. We wrote about that specific responsibility in [what your guests need to feel before they book](/journal/destination-wedding-digital-invitation-what-your-guests-need-to-feel-before-they-book).

It also changes your timeline. Guests booking international flights need to answer months earlier than guests driving across town, which makes [how you collect and track those replies](/journal/how-to-track-wedding-rsvps) a real part of the plan rather than an afterthought.`,
          image: {
            src: '/assets/journal/destination-wedding-travel-concierge.webp',
            alt: 'Destination wedding travel details showing flights, transfers and accommodation for guests',
            caption: 'Travel, transfers, and where to sleep — the questions a Como guest asks before they answer.',
          },
        },
      ],
      pullQuote: 'Balbianello with 150 guests is a beautiful, stressful day. Sola Cabiati with 40 is a wedding. Choose for the people, not the photograph.',
      faqs: [
        {
          q: 'When is the best time to get married at Lake Como?',
          a: 'Late May, early June, and September are the strongest windows — long light, manageable heat, and the lake at its best. Late September is the quiet favourite: warmer water, thinner crowds, longer golden light. Avoid mid-July and August, when the heat is real and the single-lane roads along the water double every transfer time.',
        },
        {
          q: 'How far in advance should you book a Lake Como wedding venue?',
          a: 'Eighteen months for the well-known villas on peak dates, and that is not a negotiating position — those dates are simply taken. If you are flexible on the day of the week, a Thursday or Friday in shoulder season can open doors that a Saturday in June never will.',
        },
        {
          q: 'Which Lake Como villa is best for a wedding?',
          a: 'It depends entirely on your guest count. Villa del Balbianello is the most photographed and the most logistically demanding. Villa Erba handles a large list gracefully. Villa Pizzo offers gardens and privacy. Villa Sola Cabiati is the most romantic for an intimate group. The mistake is choosing the villa from a photograph rather than from the number of people you want in the room.',
        },
      ],
    },
    'how-to-brief-a-luxury-invitation-designer': {
      intro: `Most clients arrive with a mood board. It is usually beautiful, usually assembled over months, and usually the least useful thing in the room.

A mood board tells a designer what you have already seen. It cannot tell them what you want your guests to feel — and that is the only information that actually determines what gets made.`,
      sections: [
        {
          heading: 'Start with the feeling, not the reference',
          body: `The most useful brief we have ever received was four sentences long. It described the moment the couple met, the light in the room, and one sentence about what they wanted their guests to feel when the invitation opened. There were no images attached.

From that we could make a hundred decisions — typography, pace, colour, sound, the speed of a fade — and every one of them had a reason. A mood board would have given us surfaces to imitate. The feeling gave us a destination to design toward.

Try this: finish the sentence "when our guests open this, I want them to feel ___." If the word you reach for is "excited" or "wowed", keep going. Those are too general to design against. The real answer is usually more specific and slightly harder to say out loud — and it is [the single decision the whole invitation hangs from](/journal/why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make).`,
          image: {
            src: '/assets/journal/bespoke-wedding-invitation-design-process.webp',
            alt: 'The bespoke wedding invitation design process from brief to finished digital experience',
            caption: 'A brief that describes a feeling produces decisions. A brief that describes references produces imitation.',
          },
        },
        {
          heading: 'What to bring that actually helps',
          body: `Bring the story of how you met, told badly and honestly rather than polished. Bring the venue and, more importantly, why that venue. Bring the thing you disagree about — one of you wants restraint and the other wants drama, and knowing that is worth more than either preference alone.

Bring your guest list in shape, not in number: who is travelling, who is elderly, who has never been to a wedding like this. That group decides more design choices than any aesthetic reference.

And bring what you do not want. The strongest constraint in most briefs is a single clear rejection: no script fonts, no photographs of us, nothing that looks like a template.

If the celebration asks guests to travel, say so early — [a destination invitation carries a different job](/journal/destination-wedding-digital-invitation-what-your-guests-need-to-feel-before-they-book) and it changes the brief entirely.`,
        },
        {
          heading: 'What not to bring',
          body: `Do not bring twenty references. Three is plenty, and one is often better — with a sentence about what specifically works in it. "This one, but only the pacing" is a brief. Twenty images with no annotation is a fog.

Do not bring solutions. "We want a video header" is a solution; "we want it to feel like an envelope being opened" is a brief, and the second one leaves room for something better than what you imagined.

And do not sand off the odd detail. The strange specific thing — the song, the terrible restaurant, the airport delay that started everything — is usually where the whole design comes from.`,
        },
        {
          heading: 'What happens after the brief',
          body: `A good studio will come back with questions before they come back with design. If they return with visuals immediately, they are showing you what they already had.

You should expect one direction rather than a menu of five — a menu means nobody committed. And you should expect to be told no about something you asked for, with a reason. That is what you are paying for; a supplier executes, a designer disagrees with you correctly.

Our own sequence is laid out in [the process](/process), and the range of what a commission includes is in [the collection](/collection). When you are ready, [tell us the four sentences](/contact) — not the mood board.`,
        },
      ],
      pullQuote: 'A mood board tells a designer what you have already seen. It cannot tell them what you want your guests to feel.',
      faqs: [
        {
          q: 'What should a wedding invitation design brief include?',
          a: 'The story of how you met, the venue and why you chose it, the shape of your guest list, one sentence on what you want guests to feel when it opens, and a clear statement of what you do not want. Three annotated references at most. The feeling matters more than the imagery — it is the only part that generates decisions.',
        },
        {
          q: 'How long does a bespoke invitation commission take?',
          a: 'Between four and eight weeks for most commissions, depending on scope and how much original photography or motion is involved. Destination weddings need more lead time because guests are booking travel — start earlier than you think, ideally six to nine months before the date.',
        },
        {
          q: 'Do I need to know what I want before briefing a designer?',
          a: 'No — and arriving with everything decided is usually counterproductive. You need to know how you want your guests to feel and what you are not willing to accept. The specifics are the designer’s job; if you have already made every choice, you have hired a pair of hands rather than a studio.',
        },
      ],
    },
    'destination-wedding-digital-invitation-what-your-guests-need-to-feel-before-they-book': {
      intro: `Asking someone to fly to another country for your wedding is asking for four days of their life, a flight, three nights of hotel, and a chunk of their annual leave. Frequently it is asking for more money than they would spend on their own holiday.

Most destination invitations respond to this by supplying more logistics. Flight information, hotel blocks, transfer schedules. All useful, all necessary, and none of it does the actual job — because nobody has ever booked a flight because the transfer schedule was clear.`,
      sections: [
        {
          heading: 'The decision is made before the details are read',
          body: `Your guest decides in the first fifteen seconds. Not consciously, and not by weighing costs — that comes afterwards, as justification for a decision already made emotionally.

What they are deciding is whether this feels like an event or an obligation. Whether they will regret missing it. Everything after that moment is them building a case for the answer they already reached.

Which means the invitation's first job is atmosphere, not information. Show them the light on the water and the room at dusk before you show them the shuttle timetable. This is [the difference between an invitation and a wedding website](/journal/the-difference-between-a-wedding-website-and-a-wedding-invitation-experience), and on a destination wedding the difference is worth real money.`,
          image: {
            src: '/assets/journal/luxury-digital-wedding-invitation.webp',
            alt: 'A luxury digital destination wedding invitation showing atmosphere before logistics',
            caption: 'Atmosphere first. The transfer schedule has never persuaded anyone to book a flight.',
          },
        },
        {
          heading: 'Then remove every excuse',
          body: `Once they want to come, your job inverts completely: eliminate friction. Every unanswered question is a reason to postpone the decision, and a postponed decision becomes a decline.

Answer, without being asked: which airport, and how far. What it costs to sleep, at three honest price levels rather than one aspirational one. Whether they need a car. What the weather actually does. What to wear at each event, in plain language. Whether children are welcome — say it explicitly, because the silence on that question is what people ask their friends about instead of you.

The couples who do this well see it in their reply rate. Ambiguity does not read as flexibility; it reads as risk.`,
        },
        {
          heading: 'Give them a longer runway than you think',
          body: `Domestic guests can answer in a fortnight. International guests are coordinating flights, leave, childcare, and sometimes passports.

Send the save-the-date eight to twelve months out — not for etiquette but because that is when leave gets booked. Set the RSVP deadline two to three months before the day rather than the standard four weeks, and expect to chase anyway. Guests who intend to come will still delay, because booking makes it real and costs money.

That longer runway also means your count moves for longer, which makes [tracking replies properly](/journal/how-to-track-wedding-rsvps) considerably more important than it is for a wedding down the road.`,
          image: {
            src: '/assets/journal/wedding-guest-hub-event-details.webp',
            alt: 'Destination wedding guest hub showing travel details, accommodation and dress code',
            caption: 'Every question answered in one place is one fewer reason to postpone the decision.',
          },
        },
        {
          heading: 'The invitation keeps working after the yes',
          body: `Most invitations die at the RSVP. A destination invitation should not, because your guests have months of questions ahead of them and every one of those questions currently arrives at your phone.

The link they opened in January should still be the place they check in August for the dress code, the address, and what time the boat leaves. That is the difference between an invitation and an announcement — and it is the single largest reduction in your own workload available anywhere in the planning process.

If you want to see what that looks like as a guest, [walk a live one](/nr/demo), or read about [choosing the venue itself at Lake Como](/journal/lake-como-wedding-inspiration-the-most-beautiful-venues-on-the-water).`,
        },
      ],
      pullQuote: 'Nobody has ever booked a flight because the transfer schedule was clear. They book because they decided, in fifteen seconds, that they would regret missing it.',
      faqs: [
        {
          q: 'How far in advance should you send a destination wedding invitation?',
          a: 'Send save-the-dates eight to twelve months ahead — that is when guests book annual leave, which is the real constraint. The full invitation should follow four to six months out, with an RSVP deadline two to three months before the day rather than the usual four weeks. International guests need the runway, and you will still be chasing.',
        },
        {
          q: 'What information do destination wedding guests actually need?',
          a: 'Which airport and how far it is from the venue, accommodation at three honest price levels, whether a car is necessary, what the weather really does, dress code for each event in plain language, and an explicit statement about children. The silence on that last question is what sends guests to ask each other instead of you.',
        },
        {
          q: 'Should a destination wedding invitation include the itinerary?',
          a: 'Yes, but not first. Lead with atmosphere — the light, the place, the feeling — because that is what decides attendance. The itinerary is what removes excuses once the guest already wants to come. Both matter; the order matters more.',
        },
      ],
    },
    'luxury-wedding-website-trends': {
      intro: `Trend pieces about wedding websites are usually a list of colours. This is not that, because colour was never what was changing.

What is changing is the expectation. A generation of couples who have spent a decade inside beautifully made software now open a wedding template and feel something they cannot quite name. The word is embarrassment — and it is driving every real shift below.`,
      sections: [
        {
          heading: 'The template is finally an admission',
          body: `For fifteen years a template was a neutral choice. It said nothing about you, which was the point.

That neutrality has expired. When your guest opens a page they have already seen at two other weddings this year — the same hero photo layout, the same script font, the same countdown — the template now says something specific: this was chosen in an afternoon.

The couples we speak to have started to feel that, and the reaction is not "let us pick a better template". It is [a recognition that the invitation is a design decision rather than an administrative one](/journal/why-your-wedding-invitation-is-the-most-important-design-decision-you-will-make).`,
          image: {
            src: '/assets/journal/wedding-website-vs-invitation-experience.webp',
            alt: 'A bespoke wedding invitation experience compared with a standard wedding website template',
            caption: 'The template no longer reads as neutral. It reads as a decision made quickly.',
          },
        },
        {
          heading: 'Cinematic pacing over scrolling brochures',
          body: `The strongest work now behaves like film rather than like a page: something opens, something is withheld, something is revealed. Motion is used for timing rather than decoration.

This is the opposite of the animation arms race of a few years ago, where everything moved because it could. What has replaced it is restraint — one considered moment of motion that lands, and stillness around it. A wedding invitation that opens like an envelope beats one that fades in fourteen elements on scroll.

The test is simple: if you removed the animation, would anything be lost? If not, remove it.`,
        },
        {
          heading: 'Privacy has become a feature',
          body: `The quiet shift nobody predicted. Couples increasingly do not want their wedding — their names, their venue, their date, their photographs — sitting on an indexable page that a search engine can find and a stranger can read.

The request now is for private access: a link or code that belongs to the guest, a page that search engines are told to ignore, and no public archive of the day afterwards. For high-profile couples this was always true. It has now reached everyone else, for the same reason everyone else stopped posting their children.

Expect this to accelerate rather than reverse.`,
          image: {
            src: '/assets/journal/private-wedding-invitation-access.webp',
            alt: 'A private wedding invitation requiring a personal guest access code',
            caption: 'A code that belongs to one guest — and a page no search engine is allowed to read.',
          },
        },
        {
          heading: 'One link that does everything',
          body: `The fragmentation is ending. For years a wedding meant a website, a separate RSVP tool, a spreadsheet, a WhatsApp group, and a shared photo album that nobody filled in.

What couples want now is one link: the invitation, the reply, the details, the entrance, and the memories in the same place. Not because it is technically elegant, but because every additional system is a place where guests get lost and work lands back on the couple. It is why [tracking replies](/journal/how-to-track-wedding-rsvps) and [collecting what guests leave](/journal/wedding-qr-codes-digital-guest-book) have stopped being separate conversations.

If you would like to compose something free in the meantime, [our invitation maker](/invitation-maker) is exactly that — and [a live demonstration of the full platform](/nr/demo) shows where the fragmentation goes to die.`,
        },
      ],
      pullQuote: 'The template used to be a neutral choice. It now says something specific about you: that this was decided in an afternoon.',
      faqs: [
        {
          q: 'What are the biggest wedding website trends right now?',
          a: 'Four things: templates being abandoned in favour of designed experiences, cinematic pacing replacing decorative animation, privacy becoming a requested feature rather than an afterthought, and consolidation — couples want the invitation, RSVP, details, and memories behind one link rather than five systems.',
        },
        {
          q: 'Are wedding websites still worth it?',
          a: 'The function is worth it; the format is what changed. Guests genuinely need somewhere to find the address, the dress code, and the reply. What no longer works is treating that page as the invitation itself — the page answers questions, while the invitation creates the feeling that made them want to ask.',
        },
        {
          q: 'Why are couples asking for private wedding invitations?',
          a: 'The same reason they stopped posting their children publicly. Names, dates, venues, and photographs on an indexable page are readable by anyone, indefinitely. Private access — a per-guest code, a page search engines are instructed to ignore, and no public archive afterwards — has moved from a high-profile request to a mainstream one.',
        },
      ],
    },
  };

  return bodies[slug] ?? {
    intro: `This is one of the most important questions in luxury event design, and it is one that does not get asked often enough. The answer changes everything about how you approach the invitation — and, in turn, how your guests approach your event.`,
    sections: [
      {
        heading: 'The principle',
        body: `Every element of a truly considered event experience is intentional. Not every element needs to be expensive, or elaborate, or technically complex. But every element should be deliberate — chosen with an understanding of what it communicates, what emotion it creates, and how it contributes to the whole.

The invitation is where this intentionality begins. It is the first element your guests encounter. The care you bring to it — or don't — tells them everything about what follows.`,
      },
      {
        heading: 'What this means in practice',
        body: `In practice, it means beginning the invitation design process not with aesthetic references, but with a question: what do we want our guests to feel when they open this? Not just "excited" — that is too general. What specific quality of feeling? What atmosphere? What sense of occasion?

The design answers that question. Typography, motion, colour, language — every choice is in service of a specific emotional destination. This is the discipline that separates bespoke invitation design from template selection.`,
      },
    ],
    pullQuote: 'The most important design decisions are not about aesthetics. They are about emotion.',
    faqs: [
      {
        q: 'How does Maison RSVP approach a new commission?',
        a: 'Every commission begins with a discovery conversation — not about aesthetics, but about story. We want to understand who the couple is, how they met, what the occasion means to them, and what they want their guests to feel. The design follows from that, not the other way around.',
      },
      {
        q: 'What makes a Maison RSVP invitation different from a template?',
        a: 'Every Maison RSVP invitation is designed from scratch, for a specific couple and a specific occasion. We do not have a library of layouts to customise. We begin each commission with a blank page and a story. The result is something that could not exist for any other couple.',
      },
    ],
  };
}

/* Renders prose, converting [label](/path) into internal links. */
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function RichText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={key++} href={m[2]} style={{
        color: 'var(--gold)', textDecoration: 'none',
        borderBottom: '1px solid rgba(162,129,90,.35)',
      }}>{m[1]}</Link>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const body = getArticleBody(slug);
  // Prefer siblings in the same category, then fall back to the newest others,
  // so every article always offers somewhere to go next.
  const sameCategory = ARTICLES.filter(a => a.slug !== slug && a.categorySlug === article.categorySlug);
  const others = ARTICLES
    .filter(a => a.slug !== slug && a.categorySlug !== article.categorySlug)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const relatedArticles = [...sameCategory, ...others].slice(0, 3);

  const aSchema = articleSchema({
    title:         article.title,
    description:   article.description,
    slug:          `journal/${article.slug}`,
    datePublished: article.date,
    dateModified:  article.date,
    image:         article.cover,
    authorName:    'Maison RSVP',
  });

  return (
    <>
      <Nav light />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/journal' },
          { name: article.title, path: `/journal/${article.slug}` },
        ])
      ) }} />
      {body.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(body.faqs)) }} />
      )}

      <main style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>
        {/* Hero */}
        <header style={{
          padding: 'clamp(8rem,14vw,14rem) clamp(2rem,5vw,5rem) clamp(5rem,8vw,6rem)',
          position: 'relative', overflow: 'hidden',
          background: `radial-gradient(ellipse 70% 60% at 60% 40%, #EDE5D8 0%, transparent 55%), var(--ivory)`,
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .028, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply' }} />
          <div style={{ maxWidth: 860, position: 'relative' }}>
            <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 'clamp(2rem,4vw,3rem)', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <span>·</span>
              <Link href="/journal" style={{ color: 'inherit', textDecoration: 'none' }}>Journal</Link>
              <span>·</span>
              <Link href={`/journal?category=${article.categorySlug}`} style={{ color: 'var(--gold)', textDecoration: 'none' }}>{article.category}</Link>
            </nav>
            <h1 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(2.2rem,5.5vw,5rem)', lineHeight: 1.05, letterSpacing: '-.025em', marginBottom: 'clamp(2rem,4vw,3rem)', maxWidth: '22ch' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>{article.readTime}</p>
              <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mist)' }}>
                {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {/* Cover image placeholder */}
        <div style={{ padding: '0 clamp(2rem,5vw,5rem)', marginBottom: 'clamp(5rem,8vw,8rem)' }}>
          <div style={{ width: '100%', aspectRatio: '21/9', background: 'linear-gradient(135deg, #EDE5D8 0%, #D4C9B8 55%, #C5BAA8 100%)', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '200px', opacity: .05, mixBlendMode: 'multiply' }} />
          </div>
        </div>

        {/* Article body */}
        <article style={{ padding: '0 clamp(2rem,5vw,5rem) clamp(6rem,10vw,10rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr min(680px, 100%) 1fr', gap: 0 }}>
            <div /> {/* left spacer */}
            <div>
              {/* Intro */}
              <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
                {body.intro.split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(1.05rem,1.5vw,1.25rem)', lineHeight: 1.85, color: i === 0 ? 'var(--ink)' : 'var(--mist)', marginBottom: '1.5rem' }}><RichText text={p} /></p>
                ))}
              </div>

              {/* Sections */}
              {body.sections.map((section, i) => (
                <section key={i} style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
                  <h2 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.3rem,2.5vw,2rem)', lineHeight: 1.2, letterSpacing: '-.015em', marginBottom: '1.5rem' }}>{section.heading}</h2>
                  {section.body.split('\n\n').map((p, j) => (
                    <p key={j} style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontSize: 'clamp(1rem,1.4vw,1.15rem)', lineHeight: 1.85, color: 'var(--mist)', marginBottom: '1.25rem' }}><RichText text={p} /></p>
                  ))}
                  {section.image && (
                    <figure style={{ margin: 'clamp(2rem,4vw,3rem) 0 0' }}>
                      <Image
                        src={section.image.src}
                        alt={section.image.alt}
                        width={1600}
                        height={900}
                        sizes="(max-width: 900px) 100vw, 860px"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                      {section.image.caption && (
                        <figcaption style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.62rem', letterSpacing: '.12em', color: 'var(--mist)', marginTop: '.9rem', lineHeight: 1.6 }}>
                          {section.image.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </section>
              ))}

              {/* Pull quote */}
              <blockquote style={{
                borderLeft: '2px solid var(--gold)',
                paddingLeft: 'clamp(2rem,4vw,3.5rem)',
                margin: 'clamp(3rem,6vw,6rem) 0',
              }}>
                <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.2rem,2.5vw,2rem)', lineHeight: 1.45, letterSpacing: '-.01em', color: 'var(--ink)' }}>
                  {body.pullQuote}
                </p>
              </blockquote>

              {/* FAQ section */}
              {body.faqs.length > 0 && (
                <section style={{ marginTop: 'clamp(4rem,7vw,7rem)' }}>
                  <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(2rem,4vw,3rem)' }}>Common questions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {body.faqs.map((faq, i) => (
                      <details key={i} style={{ borderTop: '1px solid var(--dust)', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                        <summary style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1rem,1.6vw,1.25rem)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                          {faq.q}
                          <span style={{ flexShrink: 0, width: 16, height: 16, color: 'var(--gold)', fontSize: '.75rem' }}>+</span>
                        </summary>
                        <p style={{ fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1.05rem)', color: 'var(--mist)', lineHeight: 1.75, marginTop: '1rem', maxWidth: '60ch' }}>{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA */}
              <div style={{ marginTop: 'clamp(5rem,8vw,8rem)', borderTop: '1px solid var(--dust)', paddingTop: 'clamp(3rem,5vw,5rem)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>Ready to begin?</p>
                <h3 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.5rem,3vw,2.8rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.5rem' }}>Tell us your story.</h3>
                <Link href="/contact" style={{ display: 'inline-block', fontFamily: 'var(--font-garamond), Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem,1.4vw,1.15rem)', color: 'var(--gold)', borderBottom: '1px solid rgba(162,129,90,.3)', paddingBottom: '.2em', textDecoration: 'none' }}>
                  Begin a commission →
                </Link>
              </div>
            </div>
            <div /> {/* right spacer */}
          </div>
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section style={{ padding: 'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem)', borderTop: '1px solid var(--dust)' }}>
            <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.58rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'clamp(3rem,5vw,5rem)' }}>Continue reading</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,380px),1fr))', gap: 'clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)' }}>
              {relatedArticles.map(a => (
                <Link key={a.slug} href={`/journal/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article>
                    <div style={{ aspectRatio: '3/2', background: 'linear-gradient(135deg, #EDE5D8 0%, #D4C9B8 100%)', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                      <Image src={a.cover} alt={a.title} fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: 'cover' }} />
                      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '180px', opacity: .04, mixBlendMode: 'multiply' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '.54rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem' }}>{a.category}</p>
                    <h3 style={{ fontFamily: 'var(--font-prata), Georgia, serif', fontSize: 'clamp(1.1rem,2vw,1.5rem)', lineHeight: 1.2, letterSpacing: '-.015em' }}>{a.title}</h3>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
