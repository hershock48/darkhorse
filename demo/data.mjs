// Every business fact for the demo lives here and nowhere else (glaze.md: facts live in
// one place). build.mjs reads this and writes the HTML. Change a price here, rebuild,
// and it is right on every page.
//
// Sources: darkhorsebrewery.com as read on 2026-09-03 (menus, hours, brand copy, beers,
// catering, Mug Club), Untappd for the Commons breakfast menu and the tap snapshot.
// Anything marked PLACEHOLDER was not on their site in a usable form and needs the
// owner's confirmation before launch.

export const site = {
  name: "Dark Horse Brewing Co.",
  legal: "Dark Horse Brewing Company",
  tagline: "Marshall, Michigan. Since 1997.",
  address: { street: "511 S. Kalamazoo Ave.", city: "Marshall", state: "MI", zip: "49068" },
  phone: "269-781-9940",
  phoneExt2: "269-781-9940 ext. 2",
  email: "emily@darkhorsebrewery.com",     // the only address published on their site today
  instagram: "https://www.instagram.com/darkhorsebrewco",
  facebook: "https://www.facebook.com/darkhorsebrewing",
  untappd: "https://untappd.com/v/dark-horse-brewing-co/7282",
  // The canonical ordering URL today. On the live build this sits behind order.darkhorsebrewery.com.
  order: "https://order.toasttab.com/online/roak-brewing-co-dark-horse-brewing-511-s-kalamazoo-ave",
  merch: "https://stores.inksoft.com/dark_horse_brewing_co/shop/home",
  base: "/demo",
  origin: "https://darkhorse.glazedweb.com",
  founded: 1997,
  mugClubCount: "4,800",   // their Mug Club page; their About page says 5,000+. PLACEHOLDER: owner to pick one.
  managingPartner: "Chuck Mascari Jr.",
};

// Hours. 24h clock, local (America/Detroit). Day index: 0 = Sunday.
// Each venue: for each day, [open, close] or null for closed, plus notes.
export const venues = [
  {
    key: "taproom", name: "Taproom",
    days: { 0: [11, 21], 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 23], 6: [11, 23] },
    kitchen: { 0: 20, 1: 21, 2: 21, 3: 21, 4: 21, 5: 22, 6: 22 },
    line: "Sun 11 to 9 · Mon to Thu 11 to 10 · Fri and Sat 11 to 11. Kitchen closes an hour before.",
  },
  {
    key: "commons", name: "Commons Market",
    days: { 0: [7, 20], 1: [11, 20], 2: [11, 20], 3: [11, 20], 4: [7, 20], 5: [7, 20], 6: [7, 20] },
    breakfast: { days: [4, 5, 6, 0], from: 7, to: 11 },
    line: "Every day 11 to 8. Breakfast Thursday to Sunday, 7 to 11 AM.",
    orderNote: "Call 269-781-9940 ext. 2 to order",
  },
  {
    key: "store", name: "General Store",
    days: { 0: [12, 20], 1: null, 2: null, 3: null, 4: [16, 20], 5: [12, 20], 6: [12, 20] },
    line: "Thu 4 to 8 · Fri to Sun 12 to 8. Merchandise and beer to go.",
  },
];

// Events. ISO start/end with the Eastern offset; the weekday is DERIVED in build.mjs and
// never typed by hand, which is the whole point. Prices are from their own listings ($0.00).
export const events = [
  // PLACEHOLDER: their listing says Mon Sep 7 but the description says "Saturday, September 19th". Using the 19th.
  { slug: "boy-mob", title: "Live Music: Boy Mob", start: "2026-09-19T18:00:00-04:00", end: "2026-09-19T21:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-boy-mob", blurb: "Boy Band Night in the Garten." },
  // PLACEHOLDER: their listing says Mon Sep 7 for a "Thursday" show. Using the Thursday after it.
  { slug: "the-fat-animals", title: "Live Music: The Fat Animals", start: "2026-09-10T19:00:00-04:00", end: "2026-09-10T21:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-fat-animals", blurb: "Live music in the Beer Garten." },
  { slug: "twilight-tunes", title: "Live Music: Twilight Tunes", start: "2026-09-12T19:00:00-04:00", end: "2026-09-12T22:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-twilight-tunes", blurb: "Live music in the Beer Garten." },
  { slug: "barefoot-blonde", title: "Live Music: Barefoot Blonde", start: "2026-09-17T19:00:00-04:00", end: "2026-09-17T21:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-barefoot-blonde", blurb: "Live music in the Beer Garten." },
  { slug: "brass-in-pocket", title: "Live Music: Brass in Pocket", start: "2026-09-24T19:00:00-04:00", end: "2026-09-24T21:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-brass-in-pocket", blurb: "Live music in the Beer Garten." },
  { slug: "september-garten-market", title: "September Garten Market", start: "2026-09-27T11:00:00-04:00", end: "2026-09-27T16:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-garten-market", blurb: "Vendors in the Garten, the last Sunday of the month, June through September. Drink and shop. Free to get in." },
  { slug: "oktoberfest-2026", title: "Oktoberfest 2026", start: "2026-10-03T18:00:00-04:00", end: "2026-10-03T21:00:00-04:00", where: "Beer Garten", price: 0, poster: "ev-oktoberfest", blurb: "Specials, music, drinks, contests, and more." },
];

// Snapshot of the Untappd board on 2026-09-03. The live build reads the feed.
export const tapSnapshot = { asOf: "September 3, 2026", pours: [
  { brand: "Dark Horse", name: "Slim Hazy Crooked Tree IPA", style: "IPA, American", abv: "4%", prices: ["8oz $6", "12oz $6.50", "16oz $7"] },
  { brand: "Dark Horse", name: "Apricot Tree Hazy IPA", style: "Hazy IPA", abv: "7%", prices: ["8oz $6", "12oz $6.50", "16oz $7"] },
  { brand: "Brew Detroit", name: "Cerveza Delray Negra", style: "Dark lager", abv: "4.8%", prices: ["8oz $5", "12oz $5.50", "16oz $6"] },
  { brand: "Brew Detroit", name: "Corktoberfest", style: "Märzen", abv: "5.7%", prices: ["8oz $6", "12oz $6.50", "16oz $7"] },
  { brand: "Altes", name: "Altes Lite", style: "Light lager", abv: "3.5%", prices: ["8oz $5", "12oz $5.50", "16oz $6"] },
  { brand: "Altes", name: "Original Detroit Lager", style: "Helles", abv: "5.2%", prices: ["8oz $5", "12oz $5.50", "16oz $6"] },
  { brand: "ROAK", name: "Powerboat", style: "Witbier", abv: "5.2%", prices: ["8oz $5", "12oz $5.50", "16oz $6"] },
] };

// Taproom menu, transcribed from /brewery. Prices are whole dollars as they print them.
// Fixed on the way through: "Sweet Hawiian" and "Sundries Tomatoes" spelled correctly, and
// Mitten Chicken moved from Desserts, where their page had it, to Sandwiches, which it is.
const gf = ["GF"];
export const menu = [
  { id: "starters", name: "Starters", items: [
    { name: "Cheese Bread", price: 11, desc: "Garlic, butter, pizza cheese, Parmesan. Ranch or pizza sauce on the side. Add jalapeños and bacon, 4." },
    { name: "Nachos", tags: gf, variants: [["Beef brisket", 15], ["Chicken", 13], ["Pulled pork", 13]], desc: "Tortilla chips, queso, lettuce, pico de gallo, black olives, sour cream, Crooked Tree salsa (salsa not GF)." },
    { name: "The Tacos", tags: gf, variants: [["Beef brisket", 12], ["Marinated sliced chicken", 10], ["Pulled pork", 10]], desc: "Cheese, pico de gallo, sour cream, with chips and Crooked Tree salsa (salsa not GF)." },
    { name: "Bavarian Pretzels", price: 11, desc: "Pretzel sticks with Boffo Brown beer cheese." },
    { name: "Wings", variants: [["4 wings", 13], ["6 wings", 18]], desc: "Asian, Plead the 5th BBQ, Buffalo, or garlic Parm. Ranch or blue cheese on the side." },
    { name: "Buffalo Chicken Dip", tags: gf, price: 9, desc: "Creamy, cheesy, with tortilla chips." },
    { name: "Spinach Artichoke Dip", tags: gf, price: 9, desc: "With tortilla chips." },
    { name: "Chips & Onion Dip", price: 9, desc: "Great Lakes kettle chips with our homemade Drake's battered fried onion dip." },
  ] },
  { id: "soups", name: "Soups", note: "All house-made.", items: [
    { name: "Dark Horse Chili", variants: [["Cup", 6], ["Bowl", 9]], desc: "Traditional red beef chili with beans. Add jalapeño, cheddar, onion, and sour cream, 3.50." },
    { name: "White Chicken Chili", variants: [["Cup", 6], ["Bowl", 9]], desc: "Roasted chicken, white beans. Add jalapeño, cheddar, onion, and sour cream, 3.50." },
    { name: "Dark Onion Soup", price: 9, desc: "Onions, beef stock, croutons, melted Swiss and Parmesan." },
  ] },
  { id: "salads", name: "Salads", note: "Gluten free depending on dressing and croutons. Ranch, Italian, blue cheese, Greek, Caesar, raspberry vinaigrette, balsamic vinaigrette, Thousand Island, honey Dijon.", items: [
    { name: "House Salad", variants: [["Full", 6], ["Half", 4]], desc: "House greens, tomatoes, cucumber, red onion." },
    { name: "Caesar Salad", variants: [["Full", 7], ["Half", 4]], desc: "Romaine, shaved Parmesan, croutons, classic Caesar." },
    { name: "Greek Salad", price: 11, desc: "Romaine, black olives, tomatoes, cucumber, garbanzo beans, feta, red onion, Greek dressing." },
    { name: "Jake's Salad", price: 11, desc: "Spring mix, marinated sliced chicken, bacon, tomato, red onion, cheddar, croutons." },
    { name: "Chopped Italian", price: 12, desc: "Romaine, salami, capicola, provolone, banana pepper, onion, tomato, cucumber, croutons, Italian vinaigrette." },
    { name: "Michigan Salad", price: 11, desc: "Spring mix, tomatoes, red onion, walnuts, dried cherries, blue cheese, raspberry vinaigrette." },
  ] },
  { id: "sandwiches", name: "Sandwiches", note: "Served with a Michigan pickle spear and slaw or Great Lakes potato chips. Ask your server for gluten free options.", items: [
    { name: "Hail Caesar Wrap", price: 15, desc: "Marinated sliced chicken, romaine, Parmesan, provolone, Caesar, tomato, red onion, pressed in a piadina wrap." },
    { name: "Portabella Wrap", price: 14, desc: "Balsamic-marinated roasted portabella, artichoke, grilled red onion, goat cheese, basil pesto, arugula, pressed in a piadina wrap." },
    { name: "Good Fella", price: 16, desc: "Salami, prosciutto, capicola, provolone, lettuce, tomato, onion, banana peppers, Italian vinaigrette, grilled sourdough baguette." },
    { name: "Rio Grande", price: 14, desc: "Turkey, bacon, pico de gallo, spinach, chipotle aioli, pepper jack. Gluten free, pretzel, or ciabatta bun." },
    { name: "Buffalo Chicken Ranch", price: 16, desc: "Roasted or Drake's battered breast, mild Buffalo, bacon, fresh mozzarella, leaf lettuce, sweet-hot pickles, ranch. Gluten free, pretzel, or ciabatta bun." },
    { name: "BBQ Pulled Pork", price: 14, desc: "Plead the 5th BBQ sauce, sweet-hot pickles, Drake's crispy onions. Pretzel roll or ciabatta." },
    { name: "Grilled Cuban", price: 13, desc: "Ham, roasted pork, Swiss, Crooked Tree mustard, sweet-hot pickles, grilled sourdough baguette." },
    { name: "Cheddar Avocado BLT", price: 13, desc: "BBQ bacon, cheddar, lettuce, tomato, avocado, pesto mayo. Gluten free, pretzel, or ciabatta bun." },
    { name: "Smoked Beef Brisket", price: 16, desc: "Provolone, Drake's crispy onions, horsey sauce. Pretzel roll or ciabatta." },
    { name: "Avocado Wrap", price: 13, desc: "Roasted turkey, avocado, Swiss, baby spinach, tomato, red onion, roasted pepper aioli. Multigrain or spinach-herb wrap." },
    { name: "Mitten Chicken", price: 13, desc: "Roasted chicken salad with mayo, onion, celery, Michigan dried cherries, and walnuts. Leaf lettuce, multigrain bread or spinach-herb wrap." },
  ] },
  { id: "calzones", name: "Calzones", items: [
    { name: "Italian", price: 15, desc: "Pepperoni, sausage, onions, house blend cheese, pizza sauce." },
    { name: "Make Your Own Zone", price: 15, desc: "Up to three fillings, pizza sauce, house blend cheese." },
  ] },
  { id: "red-pizza", name: "Red Pizza", note: "12\" or 16\" wood-fired round with tomato sauce, or a 10\"x14\" Detroit-style square. Regular toppings 1.59 (12\") / 2.59 (16\"); premium 2.59 / 3.59. Vegan cheese 3, not on Detroit-style.", items: [
    { name: "The \"Bee's\" Knees", variants: [["12\"", 15], ["16\"", 24]], desc: "Pepperoni, fresh mozzarella, basil, hot honey, extra virgin olive oil." },
    { name: "Veggie", variants: [["12\"", 15], ["16\"", 24]], desc: "Spinach, tomato, onion, green pepper, black olive, house blend cheese." },
    { name: "Margherita", variants: [["12\"", 13], ["16\"", 21]], desc: "Fresh mozzarella, fresh basil, olive oil." },
    { name: "Marshall Supreme", variants: [["12\"", 16], ["16\"", 24]], desc: "Pepperoni, sausage, mushroom, bell pepper, onion, house blend cheese." },
    { name: "Lip Stinger", variants: [["12\"", 15], ["16\"", 23]], desc: "Spicy pizza sauce, house blend cheese, hot capicola, sausage, jalapeño, banana pepper, onion, Sriracha." },
    { name: "All Choked Up", variants: [["12\"", 15], ["16\"", 24]], desc: "Artichoke hearts, roasted peppers, mushrooms, house blend cheese, goat cheese, arugula." },
    { name: "The Carnivore", variants: [["12\"", 17], ["16\"", 25]], desc: "Pepperoni, bacon, ham, sausage, house blend cheese." },
    { name: "Classic Red Your Way", variants: [["12\"", 10], ["16\"", 15]], desc: "Tomato sauce, house blend cheese. Toppings extra." },
    { name: "Detroit-Style Square", price: 16, desc: "10\"x14\", cheese, topped with pizza sauce. Toppings 2.59 veggies, 3.59 meat and dairy." },
  ] },
  { id: "white-pizza", name: "White Pizza", note: "12\" or 16\", olive oil, no tomato sauce. Toppings 1.59 / 2.59 (12\"), 2.59 / 3.59 (16\").", items: [
    { name: "Beef Brisket", variants: [["12\"", 17], ["16\"", 26]], desc: "Smoked brisket, mushrooms, provolone, horsey sauce, Drake's crispy onions." },
    { name: "Southwest Chicken", variants: [["12\"", 16], ["16\"", 25]], desc: "Marinated sliced chicken, black beans, corn, lettuce, tortilla chips, chipotle aioli, pico de gallo." },
    { name: "Sweet Hawaiian", variants: [["12\"", 15], ["16\"", 24]], desc: "Plead the 5th BBQ sauce, bacon, ham, pineapple, red onion, banana pepper, house blend cheese." },
    { name: "Plead the 5th BBQ", variants: [["12\"", 15], ["16\"", 23]], desc: "House blend cheese, Plead the 5th BBQ, pulled pork or marinated sliced chicken, cheddar, Drake's crispy onions." },
    { name: "Chicken Pesto", variants: [["12\"", 15], ["16\"", 24]], desc: "Basil pesto, house blend cheese, tomatoes, marinated sliced chicken, arugula, Parmesan." },
    { name: "Oil on the Sun", variants: [["12\"", 16], ["16\"", 25]], desc: "Garlic herb olive oil, sun-dried tomatoes, marinated sliced chicken, artichoke, feta, house blend cheese." },
    { name: "Get Him to the Greek", variants: [["12\"", 15], ["16\"", 23]], desc: "Spinach, roasted garlic, oregano, black olives, banana peppers, olive oil, house blend and feta." },
    { name: "Wild Mushroom White Truffle", variants: [["12\"", 17], ["16\"", 26]], desc: "Roasted wild mushrooms, house blend cheese, white truffle oil. Mushrooms grown locally by Sprout It." },
    { name: "Classic White Your Way", variants: [["12\"", 10], ["16\"", 15]], desc: "Olive oil, house blend cheese. Toppings extra. Add jalapeños to make it a Johnny Boy, 1.59 / 2.59." },
  ] },
  { id: "desserts", name: "Desserts", items: [
    { name: "Crème Brûlée", price: 8 },
    { name: "Peanut Butter Pie", price: 8 },
  ] },
];

// Commons Market breakfast, Thursday to Sunday 7 to 11 AM. From their Untappd menu.
export const breakfast = [
  { name: "All-Marshall Breakfast", price: 11, desc: "Two eggs any style, hash browns, bacon or sausage, toast. Swap the toast for a pancake (1) or French toast (2)." },
  { name: "Biscuits & Gravy", variants: [["Half", 6], ["Full", 10]], desc: "Two warm, flaky biscuits under our creamy sausage gravy. A Dark Horse classic." },
  { name: "Classic Omelette", price: 8, desc: "Three eggs and cheese, with toast. Add mushrooms, onions, green peppers, hash browns, bacon, sausage, or ham, 1.50 to 3." },
  { name: "Crispy Chicken 'n Waffles", variants: [["Half", 8], ["Full", 14]], desc: "A crispy buttermilk chicken tender and a golden waffle, crowned with powdered sugar." },
  { name: "Double-Decker Pancakes", variants: [["Half stack", 4], ["Full stack", 7]], desc: "Two plate-sized pancakes." },
  { name: "Early Bird Breakfast Sandwich", price: 10, desc: "Egg, cheese, and hash browns on a brioche bun with bacon, sausage, or ham." },
  { name: "Eggs Benedict", variants: [["Half", 9], ["Full", 17]], desc: "Two eggs, cheese, hollandaise, and ham on toasted focaccia." },
  { name: "French Toast", variants: [["Half", 5], ["Full", 10]], desc: "Two thick slices of Texas toast in eggs, milk, vanilla, cinnamon, and nutmeg." },
  { name: "Morning Gallop Breakfast Burrito", price: 12, desc: "Two eggs, cheese, onions, green peppers, and hash browns with bacon, sausage, or ham, wrapped in a tortilla." },
  { name: "Sunrise Breakfast Bowl", price: 12, desc: "Two eggs, hash browns, cheese, onions, and green peppers with bacon, sausage, or ham, topped with sausage gravy." },
  { name: "Sides", desc: "Egg 2 · Hash browns 2.50 · Bacon 3 · Sausage 3 · Pancake 4 · Waffle 5 · Toast 3 · Hollandaise 3" },
  { name: "Drinks", desc: "Coffee 3 · Cold brew 5 · Tea 3 · Juice 3 · Milk 3 · Soda 2 · Beermosa 6 · Bloody Mary 12" },
];

export const brands = [
  { slug: "dark-horse", name: "Dark Horse Brewing Co.", short: "Dark Horse", mark: "brand-dark-horse", city: "Marshall, MI", since: 1997, photo: "pints",
    intro: "Founded in 1997 in Marshall, Michigan, Dark Horse Brewing Company has grown into one of the state's longest-running independent craft breweries. Over the years, Dark Horse has become a name recognized by craft beer fans not just across Michigan, but around the world, built on bold beer, unforgettable experiences, and a fiercely loyal following.",
    beers: [
      { name: "Crooked Tree IPA", style: "IPA", abv: "6.5%", img: "dh-crooked-tree", desc: "Heavily dry hopped for a big aroma of pine and citrus. Big flavors, balanced between fresh hops and malt. Often described as grapefruit; finishes dry, crisp, and clean. Several medals in the IPA category." },
      { name: "Hazy Crooked Tree IPA", style: "New England IPA", abv: "7%", img: "dh-hazy-crooked-tree", desc: "Great Lakes Juice. Crooked Tree's East Coast cousin, made with oats and wheat and double dry hopped for citrus and tropical aromas. Juicy, soft body, opaque straw color, airy and slightly bitter finish. Pairs with smash burgers, kayak rides, and stormy nights." },
      { name: "Raspberry Ale", style: "Fruit ale", abv: "5%", img: "dh-raspberry", desc: "Light-bodied and easy drinking. Real raspberries late in fermentation give a mild fruit flavor over a balanced malt profile. Beer first, fruit second." },
      { name: "Blueberry Ale", style: "Fruit ale", abv: "5%", img: "dh-blueberry", desc: "Unapologetically easy to crush. A burst of fresh blueberry aroma, a golden hue, a frothy white head. Pairs with grilled steaks, smoked chicken, and sweet potato fries." },
      { name: "Smells Like a Safety Meeting", style: "IPA", abv: "8.5%", img: "dh-slasm", desc: "Our most aromatic IPA. Lots of hop aroma with just the right bitterness, a secret blend of the dankest hops we can find and a more than healthy dose of double dry hopping." },
      { name: "Amber Ale", style: "Amber ale", abv: "5.5%", img: "dh-amber", desc: "Rich copper, medium body, smooth mouthfeel. A Belgian-inspired yeast strain adds subtle notes of light fruit and clove that linger just long enough to bring you back." },
      { name: "Boffo Brown Ale", style: "American brown ale", abv: "7%", img: "dh-boffo", desc: "A brewery favorite. Full-bodied for the style, deep brown with a creamy tan head, soft and very drinkable. Malt, caramel, toffee, and a mild earthy nutty finish. Pairs with hearty food and sips of bourbon." },
      { name: "Limonata Sicilian-Style Pilsner", style: "Pilsner", abv: "4%", img: "dh-limonata", desc: "The sweet, juicy essence of Sicilian lemon in a crisp, refreshing pilsner. Slow down, stay awhile, and squeeze the day." },
    ],
    seasonal: [
      { name: "Pineapple Tree", when: "Winter and spring", style: "Hazy IPA", abv: "7%", img: "dh-pineapple-tree", desc: "Tropical pineapple sweetness, slight bitterness." },
      { name: "Apricot Hazy", when: "Winter and spring", style: "Hazy IPA", abv: "7%", img: "dh-apricot-hazy", desc: "Sweet and earthy apricot, slight bitterness." },
      { name: "Mango Tree", when: "Summer", style: "Hazy IPA", abv: "7%", img: "dh-mango-tree", desc: "Tropical mango sweetness, slight bitterness." },
      { name: "Peach Tree", when: "Summer", style: "Hazy IPA", abv: "7%", img: "dh-peach-tree", desc: "Tropical peach sweetness, slight bitterness." },
      { name: "Plead the 5th", when: "Fall", style: "Russian imperial stout", abv: "11%", img: "dh-plead-the-5th", desc: "Roasted coffee and fruity chocolate notes." },
      { name: "4Elf", when: "Winter", style: "Spiced ale", abv: "8.75%", img: "dh-4elf", desc: "Spicy aromas of cinnamon and clove." },
      { name: "Plead the 5th BBA", when: "Winter", style: "Bourbon barrel aged imperial stout", abv: "11%", img: "dh-plead-bba", desc: "Dark fruits, chocolate, caramel." },
    ] },
  { slug: "roak", name: "ROAK Brewing Co.", short: "ROAK", mark: "brand-roak", city: "Royal Oak, MI", since: 2015, photo: "brew-detroit-glass",
    intro: "ROAK Brewing Co. was founded in Royal Oak, Michigan, in 2015 and became part of the Dark Horse family in 2024. ROAK is best known for the Devil Dog oatmeal stout series and Live Wire, its American IPA.",
    beers: [
      { name: "Power Boat", style: "Belgian-style witbier", abv: "7%", img: "roak-power-boat", desc: "The lightest in body of the lineup and a powerhouse of flavor. Unmalted wheat brings a bready essence and a hazy straw color; orange zest and coriander finish it crisp and bright." },
      { name: "Live Wire", style: "India pale ale", abv: "7.5%", img: "roak-live-wire", desc: "Dry hopped with towering amounts of Cascade, Centennial, and Chinook. A solid backbone of citrus bitterness and a hint of malt sweetness. 2016 Great American Beer Festival bronze medal." },
      { name: "Devil Dog", style: "Oatmeal stout", abv: "8.3%", img: "roak-devil-dog", desc: "An oatmeal stout with a smooth, velvety texture and a bold character. Specialty chocolate malts and rolled oats give rich nutty chocolate and roasted coffee. Brewed in honor of our veterans and Devil Dog companions." },
      { name: "French Toast Devil Dog", style: "Oatmeal stout", abv: "8.3%", img: "roak-french-toast", desc: "Devil Dog layered with Sunday morning French toast: maple syrup on the nose, toasted bread and a hint of vanilla on the palate." },
      { name: "Peanut Butter Cup Devil Dog", style: "Barrel aged oatmeal stout", abv: "8.3%", img: "roak-pb-cup", desc: "All the big, bold Devil Dog character with the rich, smooth taste of peanut butter cups, aged in single-use bourbon barrels." },
    ],
    seasonal: [
      { name: "Ice Cream Man", when: "Spring and summer", style: "Kettle sour", abv: "5%", img: "roak-ice-cream-man", desc: "Citrus zest and vanilla." },
      { name: "Chocolate Lava Cake Devil Dog", when: "Fall", style: "Oatmeal stout", abv: "8.3%", img: "roak-lava-cake", desc: "Aroma and flavor of chocolate lava cake." },
    ] },
  { slug: "brew-detroit", name: "Brew Detroit", short: "Brew Detroit", mark: "brand-brew-detroit", city: "Corktown, Detroit", since: 2012, photo: "brew-detroit-glass",
    intro: "Brew Detroit was incorporated in September 2012 in Detroit's historic Corktown. It began as a contract brewing facility and quickly became part of the city's growing craft scene. In 2018 the company launched its own brand and earned a bronze medal that same year for Cerveza Delray.",
    beers: [
      { name: "Cerveza Delray", style: "Mexican-style lager", abv: "5.2%", img: "bd-cerveza-delray", desc: "Clean, crisp, and easy drinking. Pilsner, Vienna, and Munich malts; a touch of sweetness against Cascade hops. 2015 Great American Beer Festival bronze, international pilsner." },
      { name: "Cerveza Delray Negra", style: "Dark Mexican-style lager", abv: "5.2%", img: "bd-cerveza-negra", desc: "Light to medium body, dark amber, with a light, crisp, balanced roasted malt character." },
      { name: "Cloud 19", style: "Double dry-hopped New England IPA", abv: "7%", img: "bd-cloud-19", desc: "Our haziest yet. Mango, stone fruit, and tropical notes from Mosaic and Hallertau Blanc, a pillowy mouthfeel and a subtle white wine finish." },
      { name: "Campin' Beer", style: "American blonde ale", abv: "7%", img: "bd-campin-beer", desc: "It's pretty simple. A bright, clean, light blonde ale for folks goin' campin'." },
    ],
    seasonal: [
      { name: "Passion City", when: "Spring and summer", style: "Hazy pale ale", abv: "5.2%", img: "bd-passion-city", desc: "Citrus, melon, passion fruit, and tropical fruit." },
      { name: "YumTown", when: "Spring and summer", style: "Fruited American lager", abv: "5%", img: "bd-yumtown", desc: "Tart Michigan cherries and key lime." },
      { name: "Corktoberfest", when: "Fall and winter", style: "Märzen-style lager", abv: "5%", img: "bd-corktoberfest", desc: "Low hop profile and roasty malt." },
      { name: "Winter Lager", when: "Winter", style: "Spiced lager", abv: "5.7%", img: "bd-winter-lager", desc: "Cinnamon, nutmeg, and ginger." },
    ] },
  { slug: "altes", name: "Altes", short: "Altes", mark: "brand-altes", city: "Detroit", since: 1910, photo: "tap-handles",
    intro: "Altes is a true Detroit classic: a no-frills, easy-drinking lager with deep roots in the city's blue-collar history. First brewed in Detroit in the early 1900s, it became known as Detroit's Beer and earned a loyal following for its crisp taste, affordability, and unpretentious character. Today it lives on as a symbol of old-school Detroit grit, good times, and great beer shared with friends.",
    beers: [
      { name: "Original Detroit Lager", style: "Bavarian-style Helles", abv: "5.2%", img: "altes-detroit-lager", desc: "100 percent barley malt and imported German hops. Easy drinking and balanced." },
      { name: "Altes Sportsman", style: "Copper lager", abv: "5%", img: "altes-sportsman", desc: "Copper color, a smooth and inviting aroma, a malty backbone and a crisp hop finish." },
      { name: "Altes Lite", style: "Light lager", abv: "3.5%", img: "altes-lite", desc: "Only 95 calories, 100 percent barley malt and imported German hops." },
    ],
    seasonal: [] },
  { slug: "great-america", name: "Great America", short: "Great America", mark: "brand-great-america", city: "Detroit", since: null, photo: "great-america-jars",
    intro: "Born in Pennsylvania and now brewed in Detroit, Great America malt beverages pack a flavorful kick. At 10 percent ABV they are smooth, bold, and made for people who want to show up to the party with something fun.",
    beers: [
      { name: "Apple Pie", style: "Flavored malt beverage", abv: "10%", img: "ga-apple-pie", desc: "Apples and cinnamon." },
      { name: "Lemonade", style: "Flavored malt beverage", abv: "10%", img: "ga-lemonade", desc: "Sweet lemon." },
      { name: "Strawberry", style: "Flavored malt beverage", abv: "10%", img: "ga-strawberry", desc: "Sweet strawberry." },
      { name: "Blueberry", style: "Flavored malt beverage", abv: "10%", img: "ga-blueberry", desc: "Sweet blueberry." },
      { name: "Peach", style: "Flavored malt beverage", abv: "10%", img: "ga-peach", desc: "Peach and vanilla." },
    ],
    seasonal: [
      { name: "Watermelon", when: "March to July", style: "Flavored malt beverage", abv: "10%", img: "ga-watermelon", desc: "Sweet watermelon." },
      { name: "Touchdown Punch", when: "September to February", style: "Flavored malt beverage", abv: "10%", img: "ga-touchdown-punch", desc: "Tropical fruit." },
    ] },
];

export const catering = {
  contact: "emily@darkhorsebrewery.com",
  sections: [
    { name: "Snack Bar", items: [
      ["Buffalo dip", "5 per head", "with tortilla chips"], ["Spinach dip", "5 per head", "with tortilla chips"],
      ["Pretzels with beer cheese", "6 per head"], ["Garlic knots", "4 per head"], ["Smoked cut wings", "6 per head", "with sauce, ranch or blue cheese, and celery"] ] },
    { name: "Slider Bar", note: "Toppings: dill pickle chips, sweet-hot pickle chips, crispy fried onions. Sauce: BBQ, Buffalo, or Carolina mustard. Two sides: baked beans, coleslaw, chips, corn bread, pasta salad, or potato salad.", items: [
      ["Smoked pulled pork", "15 per head"], ["Shredded chicken", "15 per head"], ["Smoked brisket", "17 per head"], ["Fried chicken tenders", "15 per head"] ] },
    { name: "Burger Bar", note: "Quarter-pound patties. Buns: pretzel, brioche, or sesame. Toppings: lettuce, onion, tomato, dill pickle chips, mayo, mustard, ketchup. Cheese: cheddar, pepper jack, American. Two sides.", items: [["Burger bar", "16 per head"]] },
    { name: "Taco Bar", note: "Included: lettuce, tomato, onion, shredded cheese, sour cream, salsa. Flour or corn tortillas. Two sides: tortilla chips, Spanish rice, cilantro lime rice, elote off the cob, or refried beans.", items: [
      ["Seasoned ground beef", "15 per head"], ["Seasoned sliced chicken", "15 per head"], ["Smoked pulled pork", "15 per head"], ["Smoked brisket", "17 per head"] ] },
    { name: "Pasta Bar", note: "Noodles: spaghetti, fettuccine, rigatoni, penne, or linguine. Sauce: classic red, DH vodka, Alfredo, or pesto Alfredo. Served with house salad and garlic knots.", items: [
      ["No meat", "12 per head"], ["Seasoned sliced chicken", "14 per head"], ["Seasoned ground beef", "15 per head"], ["Meatballs", "16 per head"] ] },
  ],
};

export const mugClub = {
  intro: "With more than 4,800 mugs hanging throughout the taproom, our Mug Club is one of a kind. Each mug is handmade by Michigan artist Ryan Dalman of Marquette, individually owned by a member, and displayed in its exact spot in the taproom, a place members know by heart.",
  release: "New mugs are released once a year, typically in December, and the tradition has become legendary. Every year, loyal fans camp out and line up for the chance to claim one of the most sought-after mugs in Michigan craft beer.",
  // PLACEHOLDER: the annual price and the member perks are not published anywhere on their site.
  price: null,
  perks: null,
};

export const story = {
  h: "Great beer is messy.",
  paras: [
    "Since opening our doors in 1997, Dark Horse Brewing Company has been driven by a relentless pursuit of creativity, quality, and brewing beer that actually excites people. Trends come and go. We've always focused on making bold, memorable beer with zero interest in playing it safe.",
    "The journey hasn't always been smooth. There have been highs, lows, challenges, risks, and even a little TV-show fame along the way. Some might call it reckless. We call it part of the process. Through nearly three decades of hard work and evolution, Dark Horse has built an award-winning culture known for hop-forward IPAs, legendary stouts, crowd-favorite ales, easy-drinking session beers, unforgettable events, and a fiercely loyal community of Mug Club members.",
    "Today, under managing partner Chuck Mascari Jr., Dark Horse remains one of the few fiercely independent breweries left in Michigan craft beer, with a reputation and reach that extends far beyond state lines.",
    "What started as a brewery has grown into something much bigger: a craft brewery, a small distillery, and a true entertainment destination in Marshall, Michigan. Breakfast, lunch, and dinner at the Commons Market and Taproom, live music in the Beer Garten, and a packed calendar of signature events, from the Winterfest Beer Olympics to the 4ELF Party.",
    "Through it all, one thing has never changed: our commitment to making exceptional beverages, creating unforgettable experiences, and staying unapologetically ourselves. Visit the brewery, grab a pint, and see for yourself. Welcome to #darkhorsenation.",
  ],
};
