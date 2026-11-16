export type Photo = {
  src: string;
  alt: string;
  creator: string;
  creditUrl: string;
};

export type SourceLink = { label: string; url: string };

export type FAQ = { question: string; answer: string };

export type Destination = {
  slug: string;
  name: string;
  region: string;
  kicker: string;
  tagline: string;
  summary: string;
  story: string;
  experience: string[];
  image?: Photo;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  significance: string;
  bestTime: string;
  gettingThere: string;
  costs: string;
  accommodation: string;
  nearby: string[];
  considerations: string;
  sourceLinks: SourceLink[];
  faqs: FAQ[];
  seoTitle: string;
  seoDescription: string;
};

const pexels = (id: number, alt: string, creator: string, page: string, extension = "jpeg"): Photo => ({
  src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${extension}?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1300`,
  alt,
  creator,
  creditUrl: page,
});

export const photos = {
  lalibela: pexels(39129274, "Aerial view of the rock-hewn Church of Saint George in Lalibela, Ethiopia", "Aldo Bordoni", "https://www.pexels.com/photo/rock-hewn-church-of-lalibela-aerial-view-in-ethiopia-39129274/"),
  church: pexels(39129271, "The rock-hewn Church of Saint George in Lalibela, Ethiopia", "Aldo Bordoni", "https://www.pexels.com/photo/iconic-rock-hewn-church-of-lalibela-ethiopia-39129271/"),
  gondar: pexels(17853346, "Fasil Ghebbi castle complex in Gondar, Ethiopia", "Abenezer Muluken", "https://www.pexels.com/photo/fasil-ghebbi-castle-in-ethiopia-17853346/"),
  danakil: pexels(38975908, "A vivid geothermal landscape in Ethiopia's Danakil Depression", "Atypeek Dgn", "https://www.pexels.com/photo/vibrant-red-pool-in-danakil-depression-ethiopia-38975908/"),
  highlands: pexels(5680868, "A gelada baboon in its natural Ethiopian highland habitat", "Atypeek Dgn", "https://www.pexels.com/photo/close-up-shot-of-a-baboon-5680868/"),
  addis: pexels(35368884, "Addis Ababa skyline, Ethiopia", "Abenezer Muluken", "https://www.pexels.com/photo/aerial-view-of-addis-ababa-skyline-35368884/"),
  culture: pexels(25856925, "Ethiopian community gathering in traditional dress", "Christian Alemu", "https://www.pexels.com/photo/women-and-man-standing-in-traditional-clothing-25856925/"),
  coffee: pexels(24375991, "Traditional Ethiopian stoneware pot", "Christian Alemu", "https://www.pexels.com/photo/traditional-jar-with-decorations-24375991/"),
};

const generalConsideration =
  "This guide is not live access, security, or route advice. Regional conditions and opening arrangements can change. Read your own government's current Ethiopia advisory and confirm local conditions with an accountable, locally based operator before committing to a journey.";
const costsNote =
  "Verified current entrance fees, accommodation rates, and transport fares are not maintained on this page. Ask providers for written, itemized quotes and confirm any official site fee directly before travel. No live price or booking availability is represented here.";
const accommodationNote =
  "No independently vetted, bookable accommodation inventory is published for this destination yet. Check recent, independently sourced information, confirm location and terms with the property, and do not treat an inquiry as a reservation.";
const journeyNote =
  "There is no live route, schedule, permit, or transport feed here. Compare current options with the carrier or a locally accountable operator; road, air, access, and entry arrangements can change.";

export const destinations: Destination[] = [
  {
    slug: "lalibela",
    name: "Lalibela",
    region: "Amhara Region",
    kicker: "A living work of faith",
    tagline: "Churches carved down into the highlands.",
    summary: "A remarkable place to encounter Ethiopia's living heritage, Lalibela is known for medieval churches hewn from rock and a still-active landscape of worship. It asks for more than a quick photograph: time, humility, and respect for the people who make this a sacred place today.",
    story: "Recognized by UNESCO for its exceptional rock-hewn churches, Lalibela is an active spiritual landscape, not an open-air museum. The town and the religious communities that care for its sites belong at the heart of any thoughtful visit.",
    experience: ["history", "heritage", "culture", "photography"],
    image: photos.lalibela,
    coordinates: { lat: 12.0321, lng: 39.0473 },
    highlights: ["Rock-Hewn Churches of Lalibela", "The church of Saint George", "The wider living pilgrimage landscape"],
    significance: "The Rock-Hewn Churches of Lalibela are inscribed on UNESCO's World Heritage List. The site is a place of worship and pilgrimage as well as a major record of Ethiopian history and craftsmanship. Follow the guidance of local custodians and do not photograph worshippers without permission.",
    bestTime: "There is no single best time for every visitor. Religious calendars, highland weather, and travel conditions all matter. If you wish to attend a ceremony, learn the dates from the church or an accountable local guide and plan around the community, not just the spectacle.",
    gettingThere: `${journeyNote} Compare current flights and overland connections only after checking the latest travel advisory and the route's actual accessibility.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["gondar", "axum", "simien-mountains", "addis-ababa"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "UNESCO — Rock-Hewn Churches, Lalibela", url: "https://whc.unesco.org/en/list/18/" }, { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }],
    faqs: [
      { question: "Why is Lalibela significant?", answer: "UNESCO recognizes its medieval rock-hewn churches as World Heritage. It remains an active religious landscape, so visitors should follow site guidance and treat worship with care." },
      { question: "How much does a visit to Lalibela cost?", answer: "We do not have verified, current entrance fees, accommodation prices, or fares. Request an itemized quote and confirm any site fee with the relevant local authority." },
      { question: "Is Lalibela open and accessible right now?", answer: "This guide is not a live access or safety feed. Check your government's current regional advice and confirm conditions with a local operator before arranging travel." },
    ],
    seoTitle: "Lalibela, Ethiopia: Rock-Hewn Churches & Visitor Guide",
    seoDescription: "Discover Lalibela's UNESCO-listed rock-hewn churches, spiritual heritage, trip-planning considerations, official sources, and responsible ways to visit.",
  },
  {
    slug: "simien-mountains",
    name: "Simien Mountains",
    region: "Northern Ethiopian Highlands",
    kicker: "The high country",
    tagline: "A highland world measured in horizons.",
    summary: "A landscape of escarpments and high plateaux in northern Ethiopia, the Simien Mountains reward unhurried travelers drawn to highland walking and wildlife. The view is only part of the story: weather, altitude, local guidance, and current access deserve equal attention.",
    story: "UNESCO's listing recognizes Simien National Park for its extraordinary mountain scenery and unique wildlife. Walking itineraries should be matched to personal fitness, altitude experience, the season, and current route information from qualified local guides.",
    experience: ["adventure", "wildlife", "nature", "photography"],
    image: photos.highlands,
    coordinates: { lat: 13.188, lng: 38.066 },
    highlights: ["Dramatic highland escarpments", "Locally guided walks", "Gelada baboons in their Ethiopian highland habitat"],
    significance: "Simien National Park is on UNESCO's World Heritage List. Its wildlife and highland environment merit a low-impact visit; allow space, follow guide instructions, and never crowd or feed wild animals.",
    bestTime: "Weather changes with altitude and season. There is no forecast service on this page; check current local weather and trail/access information immediately before an outing.",
    gettingThere: `${journeyNote} Use a qualified local guide for trail planning and ask directly about permits, current access, altitude, transport, and contingency plans.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["gondar", "lalibela", "lake-tana", "axum"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "UNESCO — Simien National Park", url: "https://whc.unesco.org/en/list/9/" }, { label: "Ethiopian Wildlife Conservation Authority", url: "https://ewca.gov.et/" }],
    faqs: [
      { question: "What can you see in the Simien Mountains?", answer: "The World Heritage listing describes a dramatic highland environment and distinctive wildlife. Gelada baboons are native to Ethiopia's highlands; wildlife sightings are never guaranteed." },
      { question: "Can I hike without a local guide?", answer: "This platform does not provide current trail or permit rules. Confirm requirements, conditions, and guide arrangements with the responsible local authority before setting out." },
      { question: "Are mountain walks suitable for everyone?", answer: "Altitude, steep terrain, weather, and remoteness require personal preparation. Speak with a qualified guide and healthcare professional about your own fitness and travel-health needs." },
    ],
    seoTitle: "Simien Mountains, Ethiopia: Hiking & Visitor Guide",
    seoDescription: "Explore the Simien Mountains' highland landscapes, UNESCO heritage, locally guided walks, practical preparation, and trusted source links.",
  },
  {
    slug: "danakil-depression",
    name: "Danakil Depression",
    region: "Afar Region",
    kicker: "The elemental north",
    tagline: "An extraordinary, demanding landscape.",
    summary: "In Ethiopia's northeast, the Danakil Depression is a striking geological region of salt flats, volcanic terrain, and extreme lowland environments. It is not a casual side trip: heat, remoteness, route logistics, local permissions, and the latest regional advice need careful professional assessment.",
    story: "The landscape's unfamiliar colors and formations have made the region internationally famous, but a photograph cannot explain its conditions. Approach only with current local knowledge, a reputable operator, and a realistic plan for heat, communications, transport, and changing access.",
    experience: ["adventure", "nature", "photography"],
    image: photos.danakil,
    coordinates: { lat: 14.2419, lng: 40.3 },
    highlights: ["Distinctive geothermal terrain", "Salt landscapes", "A locally planned, supported expedition"],
    significance: "A place of geological and cultural interest in the Afar region. Travel should be locally informed, respectful, and conditional on current official guidance; the page makes no claim about present access or safety.",
    bestTime: "This is an extreme-heat environment, but this page does not publish a current forecast or season-specific risk assessment. Ask an experienced local operator to advise on conditions and whether an itinerary is appropriate at your travel dates.",
    gettingThere: "Do not treat a route shown by a map as proof of safe or permitted access. Check current government advice, consult a highly experienced local operator, and confirm transport, permissions, communications, and contingency plans before departure.",
    costs: costsNote,
    accommodation: "No verified accommodation inventory or overnight arrangements are listed here. A specialist, locally accountable operator can explain what is currently available; confirm every element directly.",
    nearby: ["axum", "lalibela", "addis-ababa"],
    considerations: "Remote, very hot terrain presents substantial physical and logistical demands. This is not a safety assessment or recommendation to travel. Check current official regional warnings first and postpone if professional advice or authorities advise against travel.",
    sourceLinks: [{ label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }, { label: "UK FCDO — Ethiopia travel advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" }, { label: "U.S. Department of State — Ethiopia advisory", url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html" }],
    faqs: [
      { question: "Is the Danakil Depression safe to visit?", answer: "We cannot assess current safety or access. The region's heat and remoteness demand careful planning; check your government's current regional advisory and speak to an experienced, locally accountable operator before considering a visit." },
      { question: "Can I visit independently?", answer: "This page does not make a recommendation about current independent travel or permits. Obtain current advice from the responsible authority and an experienced local operator." },
      { question: "Are there current prices for Danakil tours?", answer: "We do not publish verified prices or live availability. Request a written, itemized quote from an operator and check its current itinerary and contingency arrangements." },
    ],
    seoTitle: "Danakil Depression, Ethiopia: Landscape & Planning Guide",
    seoDescription: "Learn about the Danakil Depression's remarkable landscapes and the important heat, access, logistics, and official-advisory checks required before planning.",
  },
  {
    slug: "omo-valley",
    name: "Omo Valley",
    region: "Southern Ethiopia",
    kicker: "Culture, with consent",
    tagline: "Travel as a guest, not a spectator.",
    summary: "The wider Omo region holds deep archaeological significance and is home to diverse contemporary communities. Their lives and identities cannot be reduced to a travel attraction. Responsible visits begin with community consent, a locally accountable guide, transparent fees, and respect for a person's right to decline a photograph or encounter.",
    story: "UNESCO's Lower Valley of the Omo listing concerns an archaeological heritage area; it should not be confused with every contemporary community across the wider region. Plan carefully, learn who receives tourism income, and never assume that a cultural practice is staged or available on request.",
    experience: ["culture", "heritage", "photography"],
    coordinates: { lat: 5.5, lng: 36.5 },
    highlights: ["Learn from locally led cultural interpretation", "Explore the Lower Valley of the Omo's archaeological context", "Prioritize consent and fair compensation"],
    significance: "The Lower Valley of the Omo is inscribed on UNESCO's World Heritage List for its archaeological importance. Contemporary communities are distinct and self-determining; a UNESCO archaeological designation is not an endorsement of intrusive tourism or an invitation to photograph people.",
    bestTime: "Access, weather, and events vary across this large region. There is no live seasonal or regional access feed on this page; ask an accountable local organization what is appropriate at your dates and check official government advice.",
    gettingThere: `${journeyNote} Verify every route, permission, community arrangement, and transport leg before travel. Prefer organizations that can explain consent, fair payment, and local decision-making.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["addis-ababa", "bale-mountains", "lake-tana"],
    considerations: "Cultural encounters should be arranged with local consent and benefit-sharing, not as access to people. Ask before taking photographs; accept no as a complete answer. Recheck current government regional guidance before considering any trip.",
    sourceLinks: [{ label: "UNESCO — Lower Valley of the Omo", url: "https://whc.unesco.org/en/list/17/" }, { label: "UK FCDO — Ethiopia travel advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" }, { label: "U.S. Department of State — Ethiopia advisory", url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html" }],
    faqs: [
      { question: "What is the Lower Valley of the Omo known for?", answer: "UNESCO's World Heritage record identifies its archaeological importance. The wider Omo region is culturally diverse; an archaeological listing should not be misrepresented as a guide to contemporary communities." },
      { question: "How can cultural visits be respectful?", answer: "Choose locally accountable hosts, agree on expectations and payment in advance, ask explicit permission before photographing individuals, and accept any refusal without question." },
      { question: "Is access to the Omo region currently assured?", answer: "No. This page is not a live access or safety service. Review the current official regional advisory and confirm conditions locally before any arrangements." },
    ],
    seoTitle: "Omo Valley, Ethiopia: Culture, Heritage & Responsible Travel",
    seoDescription: "A respectful guide to the Omo region: UNESCO archaeology, community consent, locally accountable cultural travel, planning cautions, and official sources.",
  },
  {
    slug: "harar",
    name: "Harar",
    region: "Eastern Ethiopia",
    kicker: "Within the old walls",
    tagline: "A historic city shaped by many stories.",
    summary: "Harar Jugol, the fortified historic town, is recognized by UNESCO for its exceptional cultural heritage. A visit is best approached as time in a living city: pause for its architectural character, learn from local voices, and remember that everyday homes and religious places are not public exhibits.",
    story: "Harar's walled historic town is on UNESCO's World Heritage List. Seek interpretation from local guides and residents, ask permission before taking photographs, and follow local directions around active religious spaces.",
    experience: ["history", "heritage", "culture", "food"],
    coordinates: { lat: 9.311, lng: 42.128 },
    highlights: ["Harar Jugol's fortified historic town", "Local architectural heritage", "Thoughtful, locally guided exploration"],
    significance: "UNESCO recognizes Harar Jugol as a fortified historic town. The historic fabric sits within a living urban setting; visitors should respect residents' privacy and local religious practice.",
    bestTime: "Local climate and cultural calendars may shape an individual visit; this page does not provide a live weather forecast or event calendar. Check with a local guide and current official sources before booking.",
    gettingThere: `${journeyNote} Check today's transport schedule, airport or road access, regional conditions, and travel advice before relying on older guidebook information.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["addis-ababa", "axum", "bale-mountains"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "UNESCO — Harar Jugol", url: "https://whc.unesco.org/en/list/1189/" }, { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }],
    faqs: [
      { question: "Is Harar a UNESCO World Heritage site?", answer: "Yes. Harar Jugol, the Fortified Historic Town, appears on UNESCO's World Heritage List." },
      { question: "How should visitors behave in the historic town?", answer: "Treat Harar as a living neighborhood. Ask before photographing people or private spaces and follow local guidance around homes and places of worship." },
      { question: "Are entry fees and routes listed here?", answer: "No current rates, schedules, or live route information are published on this page. Confirm these directly with providers or relevant authorities." },
    ],
    seoTitle: "Harar, Ethiopia: Fortified Historic Town Travel Guide",
    seoDescription: "Explore Harar Jugol's UNESCO-listed historic heritage with visitor etiquette, practical planning guidance, transparent price notes, and official sources.",
  },
  {
    slug: "bale-mountains",
    name: "Bale Mountains",
    region: "Southeastern Ethiopian Highlands",
    kicker: "High forest, wide sky",
    tagline: "Wild landscapes and a rare highland mosaic.",
    summary: "The Bale Mountains combine highland terrain and forest habitats in southeastern Ethiopia. UNESCO's 2023 World Heritage inscription highlights the area's natural value, including distinctive ecosystems and endemic biodiversity. A considered visit keeps wildlife wild and confirms current access, transport, and weather conditions locally.",
    story: "The park's landscapes are varied, so a single itinerary cannot stand in for local expertise. Ask guides about current trail conditions, vehicle access, time at altitude, wildlife etiquette, and how tourism can support local conservation.",
    experience: ["nature", "wildlife", "adventure", "photography"],
    coordinates: { lat: 6.85, lng: 39.77 },
    highlights: ["Sanetti Plateau landscapes", "Harenna Forest", "Low-impact wildlife observation"],
    significance: "Bale Mountains National Park was inscribed on UNESCO's World Heritage List in 2023. UNESCO highlights the landscape mosaic and important endemic biodiversity; never approach, feed, or disturb wildlife.",
    bestTime: "The park spans different elevations and habitats, so conditions are not uniform. Check local forecasts, access information, and current trail advice with the park authority or a qualified local guide.",
    gettingThere: `${journeyNote} Contact the Ethiopian Wildlife Conservation Authority or a locally accountable operator about current park access, vehicle requirements, and permitted activities.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["addis-ababa", "harar", "omo-valley"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "UNESCO — Bale Mountains National Park", url: "https://whc.unesco.org/en/list/111/" }, { label: "Ethiopian Wildlife Conservation Authority", url: "https://ewca.gov.et/" }],
    faqs: [
      { question: "Is Bale Mountains National Park a UNESCO site?", answer: "Yes. UNESCO inscribed Bale Mountains National Park on the World Heritage List in 2023." },
      { question: "What should I know about wildlife?", answer: "This is a protected natural area with vulnerable wildlife. Keep an appropriate distance, never feed animals, and follow park staff and guide instructions." },
      { question: "Are current park permits and fees published here?", answer: "No. Contact the responsible park authority or a qualified local operator for current access conditions and charges." },
    ],
    seoTitle: "Bale Mountains, Ethiopia: National Park & Nature Guide",
    seoDescription: "Plan a responsible Bale Mountains visit with UNESCO context, highland landscape notes, wildlife etiquette, and current-source links.",
  },
  {
    slug: "lake-tana",
    name: "Lake Tana",
    region: "Amhara Region",
    kicker: "Along the water's edge",
    tagline: "Monastic heritage and a broader highland story.",
    summary: "Lake Tana is a major cultural and natural landmark of the Ethiopian highlands. UNESCO's Ethiopia heritage campaign documents its churches and monasteries as part of the country's important historic sites. Any visit to religious or island communities should be planned through current local guidance and with respect for community access and sacred practice.",
    story: "Let local custodians set the terms of a visit to an active monastery. Confirm that specific sites are welcoming visitors, ask about photography before arrival, and check the boat operator, conditions, and life-safety arrangements directly.",
    experience: ["heritage", "culture", "nature", "photography"],
    coordinates: { lat: 11.6, lng: 37.3 },
    highlights: ["Monastic and church heritage around the lake", "Locally arranged, respectful interpretation", "Check vessel and life-safety arrangements before a boat journey"],
    significance: "UNESCO's campaign on Ethiopian heritage identifies churches and monasteries around Lake Tana as important cultural sites. Active religious places are living communities; check visitor expectations with local custodians.",
    bestTime: "The lake and its surroundings have local seasonal variation. There is no live weather or water-transport update on this page. Confirm local conditions with an accountable provider on your intended dates.",
    gettingThere: `${journeyNote} For any water transfer, ask who operates the vessel, what current safety equipment is provided, and whether the destination is open to visitors.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["gondar", "simien-mountains", "lalibela", "addis-ababa"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "UNESCO — Ethiopia heritage campaign", url: "https://whc.unesco.org/en/activities/155/" }, { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }],
    faqs: [
      { question: "What heritage is associated with Lake Tana?", answer: "UNESCO's Ethiopia heritage campaign highlights the area's churches and monasteries as part of the country's historic heritage." },
      { question: "Can I visit any monastery I see on a map?", answer: "No. Confirm that a specific community welcomes visitors and follow its guidance about dress, access, sacred spaces, and photography." },
      { question: "Is lake transport included in a verified price?", answer: "No. We publish neither current fares nor live boat availability. Confirm operator, itinerary, conditions, and safety arrangements directly before paying." },
    ],
    seoTitle: "Lake Tana, Ethiopia: Monastic Heritage & Visitor Guide",
    seoDescription: "Discover Lake Tana's cultural heritage, responsible monastery visits, water-transport questions, and authoritative Ethiopian travel resources.",
  },
  {
    slug: "gondar",
    name: "Gondar",
    region: "Amhara Region",
    kicker: "A chapter written in stone",
    tagline: "Castles, courtyards, and a layered highland past.",
    summary: "Fasil Ghebbi, the historic fortified complex in Gondar, preserves a distinctive chapter of Ethiopian history. UNESCO describes a former imperial residence shaped by several architectural influences. Give the place a guide's interpretation, take care inside active religious settings, and verify current access before planning.",
    story: "UNESCO records Fasil Ghebbi as a fortified historic complex associated with Ethiopian emperors of the 16th and 17th centuries. Interpretation is more rewarding than treating the site as a film set: listen for local expertise and keep the community and conservation in view.",
    experience: ["history", "heritage", "photography", "culture"],
    image: photos.gondar,
    coordinates: { lat: 12.607, lng: 37.452 },
    highlights: ["Fasil Ghebbi", "Gondar's historic architecture", "Locally guided heritage interpretation"],
    significance: "Fasil Ghebbi, Gondar Region, is UNESCO-listed. Its UNESCO record describes a fortified complex and a distinctive period of Ethiopian civilization; any historical interpretation should distinguish source-supported history from legend.",
    bestTime: "Weather, site arrangements, and public access are subject to change. Check local conditions and your country's current Ethiopia advisory before committing to dates.",
    gettingThere: `${journeyNote} Check transport availability, regional conditions, entrance arrangements, and current access locally before building connections onward.`,
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["lake-tana", "simien-mountains", "lalibela", "axum"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "UNESCO — Fasil Ghebbi, Gondar Region", url: "https://whc.unesco.org/en/list/19/" }, { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }],
    faqs: [
      { question: "What is Fasil Ghebbi?", answer: "It is a UNESCO-listed fortified historic complex in Gondar associated with Ethiopian emperors of the 16th and 17th centuries." },
      { question: "Can I visit Fasil Ghebbi today?", answer: "This guide does not provide current opening or access information. Check with the relevant local authority and the current official regional travel advice." },
      { question: "How much does admission cost?", answer: "We don't have verified current ticket prices. Confirm the fee and payment method with the site authority before visiting." },
    ],
    seoTitle: "Gondar, Ethiopia: Fasil Ghebbi & Heritage Travel Guide",
    seoDescription: "Plan a thoughtful visit to Gondar's UNESCO-listed Fasil Ghebbi with history, cultural context, visitor considerations, and official sources.",
  },
  {
    slug: "axum",
    name: "Axum",
    region: "Tigray Region",
    kicker: "An ancient kingdom's legacy",
    tagline: "Monuments that ask you to look closer.",
    summary: "The archaeological site of Aksum, also written Axum, is inscribed on UNESCO's World Heritage List. Its monumental stelae and historic remains connect visitors with a long and important chapter of Ethiopian and Red Sea history. Historical significance does not determine present-day access: current regional advice must come first.",
    story: "UNESCO's record places Aksum among the country's most important archaeological sites. Respect the site as heritage, consult qualified local interpretation, and make no journey until you have checked up-to-date official advice on Tigray and verified local access.",
    experience: ["history", "heritage", "culture", "photography"],
    coordinates: { lat: 14.1227, lng: 38.7245 },
    highlights: ["Aksum's archaeological heritage", "Historic stelae and monuments", "Context with a qualified local interpreter"],
    significance: "Aksum is inscribed on UNESCO's World Heritage List. UNESCO identifies it as a significant archaeological heritage site in Ethiopia. Its present-day accessibility is a separate, changing question; read live official advisories first.",
    bestTime: "This page does not offer live weather, site-opening, or security updates. Consult the latest official regional travel advice and relevant local authority before selecting dates.",
    gettingThere: "No route or current access to Aksum is confirmed here. Before considering a visit, check your government's current Tigray advice, confirm local access with an accountable authority, and do not travel against official guidance.",
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["lalibela", "gondar", "simien-mountains", "addis-ababa"],
    considerations: "Aksum is in Tigray. Current regional access and government travel advice may change; this guide is not a statement that travel is advisable or possible. Check official live notices before any decision.",
    sourceLinks: [{ label: "UNESCO — Aksum", url: "https://whc.unesco.org/en/list/15/" }, { label: "UK FCDO — Ethiopia travel advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" }, { label: "U.S. Department of State — Ethiopia advisory", url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html" }],
    faqs: [
      { question: "What is Axum known for?", answer: "The archaeological site of Aksum is a UNESCO World Heritage property known for its historic monuments and stelae." },
      { question: "Is Axum currently accessible?", answer: "We cannot confirm current access. Axum is in Tigray; check your government's current Tigray-specific travel advice and verify conditions locally before making plans." },
      { question: "Where can I check the latest travel advisory?", answer: "Use your own country's official government travel advisory. This page links the UK FCDO and U.S. Department of State notices but neither substitutes for your home government's advice." },
    ],
    seoTitle: "Axum (Aksum), Ethiopia: Archaeological Heritage Guide",
    seoDescription: "Discover the UNESCO-listed archaeological heritage of Aksum with source-linked historical context and clear guidance to check current regional access first.",
  },
  {
    slug: "addis-ababa",
    name: "Addis Ababa",
    region: "Central Ethiopia",
    kicker: "A capital with many tempos",
    tagline: "A thoughtful first encounter with Ethiopia.",
    summary: "Ethiopia's capital is an important arrival point and a destination in its own right. Plan generous time rather than trying to reduce the city to a stopover: seek local voices, use current transport information, and follow the same government advice and health preparation you would for the rest of the country.",
    story: "A good city visit can leave space for its museums, markets, food, and neighborhood life without promising that any site, event, or venue is open today. Check hours and conditions directly and let local hosts set the terms of a visit.",
    experience: ["food", "coffee", "culture", "history"],
    image: photos.addis,
    coordinates: { lat: 8.9806, lng: 38.7578 },
    highlights: ["City museums and heritage institutions", "Local food and coffee experiences", "A locally guided city introduction"],
    significance: "As Ethiopia's capital, Addis Ababa is a practical starting point for national institutions and locally led cultural exploration. Check venue details directly: this guide is not an events, opening-hours, or transport feed.",
    bestTime: "The city's elevation shapes its climate, but current conditions, traffic, and event schedules can vary. Consult local sources for your dates and build flexibility into urban travel.",
    gettingThere: "Ethiopian Airlines publishes its own current flight information. For city travel, check the operator's current service and costs directly; no live flight, road, or public-transport feed is connected here.",
    costs: costsNote,
    accommodation: accommodationNote,
    nearby: ["lalibela", "bale-mountains", "harar", "lake-tana"],
    considerations: generalConsideration,
    sourceLinks: [{ label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }, { label: "Ethiopian Airlines — official site", url: "https://www.ethiopianairlines.com/" }, { label: "CDC — Ethiopia travel health", url: "https://wwwnc.cdc.gov/travel/destinations/traveler/none/ethiopia" }],
    faqs: [
      { question: "What are worthwhile things to do in Addis Ababa?", answer: "Begin with a locally guided city introduction and choose museums, markets, food, or coffee experiences that interest you. Confirm opening times directly with each venue." },
      { question: "Are Addis Ababa hotel prices listed here?", answer: "No. There is no live accommodation inventory or verified price feed. Confirm location, cancellation conditions, and total charges with the property directly." },
      { question: "Where can I check health advice before travelling?", answer: "The CDC's Ethiopia travel-health page and your national travel clinic provide health preparation information. Consult a qualified clinician for advice specific to you." },
    ],
    seoTitle: "Things to Do in Addis Ababa: Thoughtful City Guide",
    seoDescription: "Plan a richer Addis Ababa visit with local-led cultural ideas, coffee and food experiences, practical advice, and official travel-health sources.",
  },
];

export const experienceCategories = [
  { slug: "heritage", title: "History & heritage", description: "Living sacred places, archaeology, and the many layers of Ethiopian history.", links: ["lalibela", "axum", "gondar", "harar"] },
  { slug: "adventure", title: "Adventure & walking", description: "Thoughtful highland and expedition planning, guided by current local advice.", links: ["simien-mountains", "bale-mountains", "danakil-depression"] },
  { slug: "nature", title: "Wildlife & nature", description: "Distinctive highland habitats and low-impact wildlife observation.", links: ["simien-mountains", "bale-mountains", "lake-tana"] },
  { slug: "food", title: "Food & coffee culture", description: "Learn from local hosts; food traditions and rituals vary across communities.", links: ["addis-ababa", "harar", "lake-tana"] },
  { slug: "festivals", title: "Festivals & traditions", description: "Approach communal traditions with respect, context, and the host community's guidance.", links: ["lalibela", "addis-ababa", "harar"] },
  { slug: "photography", title: "Photography", description: "Remarkable landscapes and heritage, photographed with permission and care.", links: ["danakil-depression", "gondar", "simien-mountains"] },
  { slug: "culture", title: "Cultural encounters", description: "Choose locally accountable hosts, transparent fees, and encounters grounded in consent.", links: ["harar", "omo-valley", "addis-ababa"] },
  { slug: "luxury", title: "Considered comfort", description: "Make room for time, expertise, and responsible services without assumed price tags.", links: ["lalibela", "lake-tana", "addis-ababa"] },
];

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  body: { heading: string; paragraphs: string[] }[];
  sourceLinks: SourceLink[];
  coverImage?: Photo;
  seoTitle: string;
  seoDescription: string;
};

export const guides: Guide[] = [
  {
    slug: "ethiopia-travel-guide",
    title: "Ethiopia travel guide: start with the right questions",
    excerpt: "A source-first introduction to planning, regional access, heritage, and the decisions worth making before you book.",
    category: "Plan well",
    readingTime: "7 min read",
    body: [
      { heading: "Start with current official guidance", paragraphs: ["Travel conditions in Ethiopia can differ sharply between regions and change over time. This platform does not provide a live security feed or a safety rating. Read the current travel advice issued by your own government before settling on destinations, then check again before departure.", "Historical fame is not a guarantee of present-day access. A route in an old itinerary or on a map is not proof that it is open, advisable, or permitted today."] },
      { heading: "Plan around people and place", paragraphs: ["Choose a pace that leaves room for local knowledge. Confirm site access, guide arrangements, transport, opening information, and any required permissions with accountable local sources. At religious or community sites, follow local guidance and ask before photographing people.", "Ethiopia's heritage is both tangible and living. UNESCO listings can help you understand particular places, but they do not replace contemporary community voices or local interpretation."] },
      { heading: "Build a transparent budget", paragraphs: ["Transport, lodging, site fees, and services may change. This guide does not present unverified prices, bookings, or accommodation availability. Ask for a current, itemized quotation and confirm cancellation terms directly with each provider.", "Our planner records the budget you provide; it does not invent fares, calculate a live total, or promise a route is feasible."] },
      { heading: "Prepare your entry and health checks", paragraphs: ["Entry rules depend on your circumstances and can change. Start with the Ethiopian government's official visa portal and the relevant embassy or immigration authority rather than an intermediary.", "For travel health, use the CDC's Ethiopia page as a source to discuss with a qualified travel-health professional. It is not a substitute for personal medical advice."] },
    ],
    sourceLinks: [
      { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" },
      { label: "Ethiopian eVisa — official portal", url: "https://www.evisa.gov.et/" },
      { label: "UK FCDO — Ethiopia travel advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" },
      { label: "U.S. State Department — Ethiopia advisory", url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html" },
    ],
    seoTitle: "Ethiopia Travel Guide: Plan a Thoughtful First Visit",
    seoDescription: "An honest Ethiopia travel guide to official advisories, regional access, visa sources, cultural respect, health preparation, and transparent budgeting.",
  },
  {
    slug: "best-time-to-visit-ethiopia",
    title: "Best time to visit Ethiopia: plan for place, not averages",
    excerpt: "Elevation, local calendars, weather, and current access matter more than one country-wide 'best month'.",
    category: "Seasons",
    readingTime: "5 min read",
    body: [
      { heading: "There is no one-size-fits-all season", paragraphs: ["Ethiopia spans markedly different elevations and landscapes. Conditions in the highlands are not a proxy for every lowland or regional destination. A simple national calendar can therefore mislead.", "Use a reputable forecast for your actual destination and dates, then ask a locally based guide about the ground conditions. This page is not a real-time weather or seasonal-closure service."] },
      { heading: "Culture has its own calendar", paragraphs: ["Religious observances and community events matter to the people whose traditions they express. Dates and local arrangements should be confirmed with the host institution or a trusted local guide. Attend as a respectful guest rather than expecting a public performance.", "Ethiopian Epiphany is inscribed on UNESCO's Representative List of Intangible Cultural Heritage. That designation does not mean every gathering is a visitor event; follow the community's own guidance."] },
      { heading: "Check conditions before choosing a destination", paragraphs: ["Weather does not tell you whether a route is currently safe or open. Read current government travel advice and confirm local access independently, especially before visiting remote or border regions.", "If the current guidance advises against your planned destination, postpone or choose a different plan. Our itinerary examples are ideas, not live route clearances."] },
    ],
    sourceLinks: [
      { label: "UNESCO — Ethiopian Epiphany", url: "https://ich.unesco.org/en/RL/ethiopian-epiphany-01491" },
      { label: "Ethiopian Meteorology Institute", url: "https://ethiomet.gov.et/" },
      { label: "UK FCDO — Ethiopia travel advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" },
    ],
    coverImage: photos.highlands,
    seoTitle: "Best Time to Visit Ethiopia: Weather, Regions & Festivals",
    seoDescription: "Discover why Ethiopia has no single best travel month. Compare elevation, weather sources, community-led festival planning, and live-access checks.",
  },
  {
    slug: "ethiopia-travel-costs",
    title: "Ethiopia travel costs: build a real budget, not a guessed one",
    excerpt: "No invented daily rates. A practical framework for getting current, itemized quotes across your actual route.",
    category: "Budget & logistics",
    readingTime: "4 min read",
    body: [
      { heading: "Why this guide has no headline daily rate", paragraphs: ["We do not have verified, current prices for flights, permits, park entry, guides, hotels, meals, or road transport across Ethiopia. Publishing a neat per-day figure without comparable dates, routes, and inclusions would give a false sense of precision.", "Season, services, location, party size, and changing operations can all affect a real quotation. Treat third-party estimates as provisional until the provider confirms them in writing."] },
      { heading: "Build your own itemized estimate", paragraphs: ["Request separate quotes for international and domestic transport, local ground transfers, guides, site or park fees, lodging, meals, insurance, equipment, and cancellation. Ask whether the price is per traveler or per group, which currency applies, and what happens if access changes.", "For a remote itinerary, ask how communications, emergency response, permits, and alternate plans are handled. Never infer that the cheapest itinerary offers appropriate support."] },
      { heading: "Let the planner store your budget", paragraphs: ["The Ethiopia Unfolded planner stores the approximate budget you enter so you can organize the conversation with a provider. It does not use live tariffs, return a calculated quote, or book anything.", "Any price or availability must be confirmed directly with an actual provider. We currently show no verified hotel inventory or integrated booking platform."] },
    ],
    sourceLinks: [{ label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }, { label: "Ethiopian Airlines — official site", url: "https://www.ethiopianairlines.com/" }],
    seoTitle: "Ethiopia Travel Costs: A Transparent Trip Budget Guide",
    seoDescription: "Plan Ethiopia travel costs honestly with an itemized budget framework for transport, accommodation, guides, fees, and contingencies—without unverified prices.",
  },
  {
    slug: "ethiopia-itinerary",
    title: "Ethiopia itinerary: build a route around your real priorities",
    excerpt: "A responsible route starts with today's regional guidance, realistic time, and the people who live along the way.",
    category: "Itineraries",
    readingTime: "6 min read",
    body: [
      { heading: "Check today's access before drawing a line on the map", paragraphs: ["Itinerary templates do not reflect live access, security, timetables, permits, or transport. Start with the latest government advice for each region under consideration and confirm access with a qualified local operator.", "If any relevant authority advises against travel, do not use this itinerary as a reason to go. Consider an alternative that meets current official guidance."] },
      { heading: "Choose fewer places and more time", paragraphs: ["Ethiopia's regions differ in geography, experience, and logistics. Rather than stringing together distant points because they appear close on a screen, ask a local operator how travel time and seasonal conditions work on your dates.", "The sample sequences in our planner are organizing prompts, not recommended connections. Nothing here represents a verified journey or travel time."] },
      { heading: "Use maps as maps—not safety checks", paragraphs: ["A geographic map can help with orientation, but it does not show road conditions, roadblocks, permits, advisories, or transport schedules. Confirm all of those separately.", "Save a copy of your final written itinerary and leave it with a trusted contact. Use the official travel alert systems provided by your own government where available."] },
    ],
    sourceLinks: [{ label: "UK FCDO — Ethiopia travel advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" }, { label: "U.S. State Department — Ethiopia advisory", url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html" }, { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }],
    coverImage: photos.gondar,
    seoTitle: "Ethiopia Itinerary: A Flexible, Safety-First Planning Guide",
    seoDescription: "Create an Ethiopia itinerary around verified regional access, realistic time, local expertise, and your own interests—never assume a route is currently clear.",
  },
  {
    slug: "ethiopia-visa-entry",
    title: "Ethiopia visa and entry information: use official sources",
    excerpt: "Visa rules can change and depend on your situation. Start—and finish—with the official Ethiopian immigration service.",
    category: "Entry requirements",
    readingTime: "3 min read",
    body: [
      { heading: "Check your own requirements", paragraphs: ["Nationality, travel purpose, passport, and entry route can affect your entry requirements. This page deliberately avoids promising eligibility, approval, a processing time, or a visa price.", "Use the Ethiopian government's official eVisa portal or contact the relevant embassy or immigration authority directly. Confirm the result against your specific passport and intended journey before paying for travel."] },
      { heading: "Watch for look-alike services", paragraphs: ["Verify that you are on a government domain before entering passport details or making a payment. Unaffiliated intermediaries are not the issuing authority and may charge additional fees.", "Rules and websites can change. Treat the official portal as the definitive source for current application instructions."] },
    ],
    sourceLinks: [{ label: "Ethiopian eVisa — official government portal", url: "https://www.evisa.gov.et/" }, { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }],
    seoTitle: "Ethiopia Visa & Entry Requirements: Official Source Guide",
    seoDescription: "Find Ethiopia's official eVisa portal and a careful checklist for checking passport-specific entry requirements without outdated prices or promises.",
  },
  {
    slug: "things-to-do-in-addis-ababa",
    title: "Things to do in Addis Ababa: start with the city's own voices",
    excerpt: "An invitation to experience the Ethiopian capital through locally led museums, food, coffee, and neighborhood life.",
    category: "City guide",
    readingTime: "5 min read",
    body: [
      { heading: "Give the capital more than a transfer", paragraphs: ["Addis Ababa is both a major arrival point and a layered city. A locally guided introduction can help visitors understand its neighborhoods and history without pretending that any one itinerary can represent everyone's city.", "Museums, markets, coffee, and food can all become thoughtful points of entry. Confirm each venue's current opening hours, access, photography rules, and transport directly before you go."] },
      { heading: "Coffee is hospitality, not an attraction on demand", paragraphs: ["Ethiopia's coffee culture is meaningful and varied. If you are invited to take part in a ceremony, accept only when it suits you, follow your host's lead, and ask before filming or photographing. Not every cafe or household offers the same experience.", "Choose a local host who is transparent about what the experience includes and who benefits from it."] },
      { heading: "Use live sources for practical details", paragraphs: ["No venue-hours, city-transport, hotel-rate, or booking feed is connected to this guide. Use current local information, the official airline website for flights, and your government's current Ethiopia travel advice before traveling."] },
    ],
    sourceLinks: [{ label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" }, { label: "CDC — Ethiopia travel health", url: "https://wwwnc.cdc.gov/travel/destinations/traveler/none/ethiopia" }, { label: "Ethiopian Airlines — official site", url: "https://www.ethiopianairlines.com/" }],
    coverImage: photos.addis,
    seoTitle: "Things to Do in Addis Ababa: A Local-Led City Guide",
    seoDescription: "Discover thoughtful things to do in Addis Ababa—from local guides and city heritage to food and coffee—with current-source links and no invented opening hours.",
  },
];

export type Story = { slug: string; title: string; deck: string; category: string; image?: Photo; href: string; author: string; body: { heading: string; paragraphs: string[] }[] };

export const stories: Story[] = [
  {
    slug: "coffee-as-a-gesture-of-welcome",
    title: "Coffee, offered as a gesture of welcome",
    deck: "A small guide to being a guest in a meaningful ritual—and to letting your host set the pace.",
    category: "Culture, with care",
    image: photos.coffee,
    href: "/culture#coffee",
    author: "Ethiopia Unfolded Editorial Desk",
    body: [
      { heading: "A cup is not the whole story", paragraphs: ["Coffee traditions in Ethiopia are deeply associated with hospitality, but they are not a single, uniform performance. The people hosting, their community, setting, and moment shape the experience.", "If a host welcomes you to a ceremony, ask what is appropriate, follow their lead, and receive the invitation with appreciation. A visitor is not entitled to someone's time, private space, or a photograph."] },
      { heading: "Look beyond the lens", paragraphs: ["Ask before photographing the people, home, or objects involved. Be especially mindful of children and religious or private spaces. If the answer is no, put the camera away without making the interaction about your disappointment.", "If you arrange a paid coffee experience, ask who is hosting, what the fee includes, and where the payment goes. A sincere exchange should leave the host in control."] },
    ],
  },
  {
    slug: "a-place-is-more-than-a-landmark",
    title: "A place is more than the landmark on its map",
    deck: "UNESCO listings explain one dimension of heritage. Living communities bring the rest into focus.",
    category: "Heritage & place",
    image: photos.lalibela,
    href: "/destinations/lalibela",
    author: "Ethiopia Unfolded Editorial Desk",
    body: [
      { heading: "Read the listing, then look closer", paragraphs: ["A World Heritage listing can introduce a site's recognized universal value. It is a starting source, not the whole context: local custodians, residents, and practitioners have their own voices and responsibilities.", "At an active religious site, ask before entering a space, wearing shoes, taking a photograph, or joining an event. If a guide says a space is closed to visitors, respect the boundary."] },
      { heading: "Visit at the pace of the place", paragraphs: ["Fewer stops and more attentive time can make a journey richer. Choose local interpretation, confirm that fees are clear, and let current official access advice shape the itinerary before you book anything.", "Stories on this site are editorial context, not claims of first-hand reporting. We link to primary sources where possible and flag where live information is not connected."] },
    ],
  },
  {
    slug: "wildlife-is-not-a-photo-prop",
    title: "Wildlife is not a photo prop",
    deck: "A gentler way to observe Ethiopia's remarkable wildlife—one that gives animals room to remain wild.",
    category: "Wild places",
    image: photos.highlands,
    href: "/destinations/simien-mountains",
    author: "Ethiopia Unfolded Editorial Desk",
    body: [
      { heading: "Observe with space", paragraphs: ["Wild animals should never be fed, chased, touched, or crowded to produce a photograph. Keep an appropriate distance, stay on the route permitted by the responsible authority, and follow the direction of park staff and qualified guides.", "Sightings are never guaranteed. If an operator promises direct wildlife contact or a guaranteed encounter, ask difficult questions about animal welfare and local rules before paying."] },
      { heading: "Let conservation inform your choices", paragraphs: ["Ask how visitor fees or trip spending support local conservation and communities, and request clear answers rather than assuming every tour is responsible.", "The Simien Mountains and Bale Mountains have UNESCO-listed protected areas. UNESCO sources describe their recognized heritage; they do not provide live travel or wildlife sighting information."] },
    ],
  },
];

export const cultureSources: SourceLink[] = [
  { label: "UNESCO — Ethiopian Epiphany", url: "https://ich.unesco.org/en/RL/ethiopian-epiphany-01491" },
  { label: "UNESCO — Ethiopian heritage campaign", url: "https://whc.unesco.org/en/activities/155/" },
  { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" },
];

export const travelSources = [
  { category: "Official travel advisories", title: "Your government's country advice", description: "Read the latest regional warnings, access conditions, and emergency guidance from your own foreign ministry before settling an itinerary.", links: [
    { label: "United Kingdom — FCDO Ethiopia advice", url: "https://www.gov.uk/foreign-travel-advice/ethiopia" },
    { label: "United States — Department of State Ethiopia advisory", url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ethiopia-travel-advisory.html" },
    { label: "Canada — Ethiopia travel advice", url: "https://travel.gc.ca/destinations/ethiopia" },
    { label: "Australia — Smartraveller Ethiopia advice", url: "https://www.smartraveller.gov.au/destinations/africa/ethiopia" },
  ] },
  { category: "Entry & immigration", title: "Use the Ethiopian government's visa service", description: "Visa eligibility, entry conditions, and fees depend on your circumstances and can change. Confirm details with the official immigration service.", links: [
    { label: "Ethiopian eVisa — official government portal", url: "https://www.evisa.gov.et/" },
    { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" },
  ] },
  { category: "Travel health", title: "Prepare with a qualified health professional", description: "Country-specific health information cannot replace advice based on your itinerary, medical history, and needs. Consult a qualified travel clinic or clinician well before departure.", links: [
    { label: "U.S. CDC — Ethiopia travel health", url: "https://wwwnc.cdc.gov/travel/destinations/traveler/none/ethiopia" },
  ] },
  { category: "Weather & seasons", title: "Check the conditions for your actual region", description: "Elevation and local conditions vary. A country-wide average or an old guidebook is no substitute for a current destination forecast and local confirmation.", links: [
    { label: "Ethiopian Meteorology Institute", url: "https://ethiomet.gov.et/" },
  ] },
  { category: "Flights & transport", title: "Confirm every leg directly", description: "No live schedule, road-condition, ticket-price, or transport-access feed is connected to this platform. Check all details with the operating carrier or provider.", links: [
    { label: "Ethiopian Airlines — official site", url: "https://www.ethiopianairlines.com/" },
    { label: "Ethiopia's Ministry of Tourism", url: "https://visitethiopia.et/" },
  ] },
];
