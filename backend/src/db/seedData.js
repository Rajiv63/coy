'use strict';

/**
 * 32 mock profiles for the Coy dating app.
 * Photos use curated i.pravatar.cc portraits.
 */
const PROFILES = [
  { id: 'p01', name: 'Aria Chen',       age: 24, photo: 'https://i.pravatar.cc/600?img=1',  location: 'Brooklyn, NY',           bio: 'Architectural designer & weekend ceramicist. Always hunting the city\'s best matcha latte.',          interests: ['Ceramics','Architecture','Matcha','Film Photography','Indie Rock'] },
  { id: 'p02', name: 'Maya Patel',      age: 25, photo: 'https://i.pravatar.cc/600?img=5',  location: 'NYU Langone',            bio: 'Biomedical researcher by day, spicy noodle connoisseur by night. Trade Spotify playlists with me?', interests: ['Biotech','Thrifting','Vinyl Records','Spicy Food','Running'] },
  { id: 'p03', name: 'Julian Vance',    age: 27, photo: 'https://i.pravatar.cc/600?img=11', location: 'East Village, NY',       bio: 'Documentary cinematographer. Probably on an espresso-fuelled editing sprint.',                        interests: ['Cinema','Espresso','Hiking','35mm Film','Jazz'] },
  { id: 'p04', name: 'Zoe Kline',       age: 23, photo: 'https://i.pravatar.cc/600?img=16', location: 'Williamsburg, NY',       bio: 'Graphic artist & risograph publisher. Obsessed with brutalist type and sourdough.',                   interests: ['Graphic Design','Risograph','Baking','Museums','Synthesizers'] },
  { id: 'p05', name: 'Elena Rostova',   age: 26, photo: 'https://i.pravatar.cc/600?img=20', location: 'SoHo, NY',               bio: 'Fintech product lead who escapes into oil painting and gravel biking on weekends.',                    interests: ['Natural Wine','Oil Painting','Cycling','Podcasts','Bouldering'] },
  { id: 'p06', name: 'Marcus Bell',     age: 28, photo: 'https://i.pravatar.cc/600?img=12', location: 'Greenwich Village',      bio: 'Jazz trumpet player and cocktail bartender. Can make you the sharpest Sazerac.',                     interests: ['Jazz','Mixology','Live Music','Cooking','Vinyl'] },
  { id: 'p07', name: 'Sora Tanaka',     age: 24, photo: 'https://i.pravatar.cc/600?img=25', location: 'Columbia University',    bio: 'UX researcher & plant collector. Cold brew season is all 12 months.',                                 interests: ['Plant Care','UX Research','Cold Brew','Board Games','Travel'] },
  { id: 'p08', name: 'Devon Miller',    age: 29, photo: 'https://i.pravatar.cc/600?img=15', location: 'DUMBO, Brooklyn',        bio: 'Software engineer building climate tech tools. Loves rock climbing and pasta from scratch.',          interests: ['Climate Tech','Rock Climbing','Pasta Making','Sci-Fi','Coffee'] },
  { id: 'p09', name: 'Lucas Silva',     age: 27, photo: 'https://i.pravatar.cc/600?img=33', location: 'Rockaway Beach, Queens', bio: 'Brazilian expat, sound designer & surfer. I\'ll bring homemade brigadeiros.',                        interests: ['Surfing','Sound Design','Cooking','Bossa Nova','Dogs'] },
  { id: 'p10', name: 'Amara Okafor',    age: 25, photo: 'https://i.pravatar.cc/600?img=47', location: 'Lower East Side',        bio: 'Fashion archivist & vintage curator. Let\'s debate 90s runway over dumplings.',                      interests: ['Vintage Fashion','Art History','Dumplings','Photography','Poetry'] },
  { id: 'p11', name: 'Kai Takahashi',   age: 26, photo: 'https://i.pravatar.cc/600?img=52', location: 'Astoria, Queens',        bio: 'Pastry chef exploring laminated doughs. Bonsai collector & 10k runner.',                             interests: ['Pastry','Bonsai','Running','Japanese Teas','Street Food'] },
  { id: 'p12', name: 'Isla MacLeod',    age: 24, photo: 'https://i.pravatar.cc/600?img=49', location: 'Cobble Hill, Brooklyn',  bio: 'Environmental journalist. Avid paddleboarder and keeper of 2 adopted cats.',                        interests: ['Journalism','Ocean Conservation','Paddleboarding','Cats','Craft Beer'] },
  { id: 'p13', name: 'Rohan Mehta',     age: 28, photo: 'https://i.pravatar.cc/600?img=18', location: 'Upper West Side',        bio: 'Astronomer & data nerd. Looking for someone to stargaze with far from light pollution.',            interests: ['Astronomy','Data Science','Stargazing','Board Games','Cardio'] },
  { id: 'p14', name: 'Chloe Dubois',    age: 23, photo: 'https://i.pravatar.cc/600?img=44', location: 'Bushwick, Brooklyn',     bio: 'Florist & botanical stylist. Show me your weirdest hobby.',                                           interests: ['Botany','Floral Design','Pottery','Flea Markets','Indie Pop'] },
  { id: 'p15', name: 'Mateo Morales',   age: 27, photo: 'https://i.pravatar.cc/600?img=22', location: 'Long Island City',       bio: 'Urban planner making cities pedestrian paradise. Weekend gravel rider.',                             interests: ['Urbanism','Cycling','Salsa Dancing','Architecture','Tacos'] },
  { id: 'p16', name: 'Nadia Al-Mansoor',age: 26, photo: 'https://i.pravatar.cc/600?img=48', location: 'Morningside Heights',    bio: 'Human rights attorney. Recharges with trail runs and contemporary art galleries.',                 interests: ['Human Rights','Trail Running','Art Galleries','Middle Eastern Cuisine','Reading'] },
  { id: 'p17', name: 'Gabriel Kim',     age: 25, photo: 'https://i.pravatar.cc/600?img=57', location: 'Bed-Stuy, Brooklyn',     bio: 'Electronic music producer & barista. 100% success rate recommending your new fav artist.',         interests: ['Music Production','Coffee','Vintage Synths','Skateboarding','Pho'] },
  { id: 'p18', name: "Liam O'Connor",   age: 28, photo: 'https://i.pravatar.cc/600?img=53', location: 'Red Hook, Brooklyn',     bio: 'Furniture builder & woodworking instructor. Finding peace in quiet workshops.',                     interests: ['Woodworking','Design','Craft Beer','Camping','Acoustic Guitar'] },
  { id: 'p19', name: 'Talia Rose',      age: 22, photo: 'https://i.pravatar.cc/600?img=43', location: 'The New School',         bio: 'Art history major & museum tour guide. Ask me about the weirdest theft in Louvre history.',       interests: ['Art History','Museums','Croissant Tasting','Thrifting','Film'] },
  { id: 'p20', name: 'Felix Weber',     age: 30, photo: 'https://i.pravatar.cc/600?img=14', location: 'Tribeca, NY',            bio: 'Industrial designer passionate about minimalist everyday carry. Dog walker at heart.',            interests: ['Minimalism','Industrial Design','Dogs','Espresso Martinis','Tennis'] },
  { id: 'p21', name: 'Sophia Lindqvist',age: 25, photo: 'https://i.pravatar.cc/600?img=37', location: 'Greenpoint, Brooklyn',   bio: 'Swedish ceramicist in NYC. Fika, sauna, cold plunges, and moody Scandinavian synth-pop.',          interests: ['Ceramics','Fika','Sauna','Synth-Pop','Interior Design'] },
  { id: 'p22', name: 'Dante Rossi',     age: 29, photo: 'https://i.pravatar.cc/600?img=19', location: 'Chelsea, NY',            bio: 'Sommelier & food writer. Volcanic wines and the best corner slice in Queens.',                     interests: ['Wine','Food Writing','Italian Cuisine','Literature','Tennis'] },
  { id: 'p23', name: 'Yuki Morimoto',   age: 24, photo: 'https://i.pravatar.cc/600?img=59', location: 'Cornell Tech / Roosevelt Island', bio: 'Robotics engineer & competitive boulderer. Looking for someone to solve beta with.',      interests: ['Robotics','Bouldering','Anime','Matcha','VR Gaming'] },
  { id: 'p24', name: 'Hannah Brooks',   age: 26, photo: 'https://i.pravatar.cc/600?img=45', location: 'Gramercy, NY',           bio: 'Pediatric nurse with boundless energy. Stand-up comedy open mics & farmers markets off duty.',   interests: ['Healthcare','Stand-up Comedy','Farmers Markets','Baking','Dogs'] },
  { id: 'p25', name: 'Samira Khan',     age: 27, photo: 'https://i.pravatar.cc/600?img=50', location: 'Crown Heights, Brooklyn', bio: 'Documentary podcast producer. Tell me your deepest rabbit hole.',                                interests: ['Podcasting','Storytelling','Vinyl','Tea Ceremonies','Biking'] },
  { id: 'p26', name: 'Noah Sterling',   age: 26, photo: 'https://i.pravatar.cc/600?img=24', location: 'East Williamsburg',      bio: 'Brand strategist & indie game developer. Late night karaoke and ramen joints.',                   interests: ['Indie Games','Karaoke','Ramen','Pixel Art','Sci-Fi'] },
  { id: 'p27', name: 'Camila Santos',   age: 24, photo: 'https://i.pravatar.cc/600?img=35', location: "Hell's Kitchen",         bio: 'Choreographer & contemporary dancer. Movement is my language; coffee is my fuel.',               interests: ['Dance','Theater','Coffee','Fitness','Film'] },
  { id: 'p28', name: 'Ethan Ward',      age: 29, photo: 'https://i.pravatar.cc/600?img=17', location: 'Park Slope, Brooklyn',   bio: 'Landscape architect turning asphalt into green corridors. Big hiker & book collector.',           interests: ['Landscape Design','Hiking','Bookstores','Sourdough','Acoustic Folk'] },
  { id: 'p29', name: 'Zara Thorne',     age: 25, photo: 'https://i.pravatar.cc/600?img=46', location: 'Columbia University',    bio: 'Astrophysics PhD student modelling neutron star collisions. Cello player at night.',             interests: ['Astrophysics','Cello','Folk Music','Tea','Board Games'] },
  { id: 'p30', name: 'Leo Montgomery',  age: 28, photo: 'https://i.pravatar.cc/600?img=13', location: 'West Village',           bio: 'Vintage watch restorer & horology nerd. Deliberate living and quiet morning walks.',              interests: ['Horology','Antiques','Mechanics','Walking','Espresso'] },
  { id: 'p31', name: 'Mia Larsson',     age: 23, photo: 'https://i.pravatar.cc/600?img=42', location: 'NYU Tisch',              bio: 'Film student & analog photographer. Let me shoot a roll of Portra 400 with you.',               interests: ['Cinematography','35mm Film','Darkroom','Coffee','New Wave Cinema'] },
  { id: 'p32', name: 'Oscar Ruiz',      age: 27, photo: 'https://i.pravatar.cc/600?img=10', location: 'Fort Greene, Brooklyn',  bio: 'Coffee roaster & shop owner. I take bean origins very seriously, life not at all.',              interests: ['Coffee Roasting','Cycling','Vinyl','Cats','Live Comedy'] },
];

/**
 * 7 profiles that have already "liked" user "me" in seed data.
 * DEMO HINT (Kept in README/docs only):
 * 1. Maya Patel (p02)
 * 2. Elena Rostova (p05)
 * 3. Lucas Silva (p09)
 * 4. Chloe Dubois (p14)
 * 5. Liam O'Connor (p18)
 * 6. Sophia Lindqvist (p21)
 * 7. Noah Sterling (p26)
 */
const PRE_LIKED_IDS = ['p02', 'p05', 'p09', 'p14', 'p18', 'p21', 'p26'];

module.exports = { PROFILES, PRE_LIKED_IDS };
