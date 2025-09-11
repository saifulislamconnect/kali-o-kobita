export interface Poem {
  title: string;
  lines: string[];
  seed: number;
  author?: string;
  year?: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  coverSeed: number;
  author?: string;
  book?: string;
  year?: string;
  poems: Poem[];
}

// Collection of Bengali poetry books
export const books: Book[] = [
        {
            "id": "helal-hafiz-nishiddho-sampadokiyo",
            "title": "নিষিদ্ধ সম্পাদকীয়",
            "description": "ঊনসত্তরের গণঅভ্যুত্থান ও দেশপ্রেম নিয়ে লেখা কবিতা",
            "coverSeed": 101,
            "author": "হেলাল হাফিজ",
            "book": "যে জলে আগুন জ্বলে",
            "poems": [
                {
                    "title": "নিষিদ্ধ সম্পাদকীয়",
                    "lines": [
                        "এখন যৌবন যার মিছিলে যাবার তার শ্রেষ্ঠ সময়",
                        "এখন যৌবন যার যুদ্ধে যাবার তার শ্রেষ্ঠ সময়",
                        "মিছিলের সব হাত, কণ্ঠ, পা এক নয়",
                        "সেখানে সংসারী থাকে, সংসার বিরাগী থাকে"
                    ],
                    "seed": 202,
                    "author": "হেলাল হাফিজ"
                }
            ]
        },
        {
            "id": "jibonananda-akashlina",
            "title": "আকাশলীনা",
            "description": "প্রেম ও বিরহের আবেগে লেখা একটি সুন্দর কবিতা",
            "coverSeed": 79,
            "author": "জীবনানন্দ দাশ",
            "book": "সত্তি তারার তিমির (Satti Tarar Timir)",
            "poems": [
                {
                    "title": "আকাশলীনা",
                    "lines": [
                        "সুরঞ্জনা, ঐখানে যেয়ো নাকো তুমি, বোলো নাকো কথা ঐ যুবকের সাথে;",
                        "ফিরে এসো সুরঞ্জনা: নক্ষত্রের রুপালি আগুন ভরা রাতে;",
                        "ফিরে এসো এই মাঠে, ঢেউয়ে; ফিরে এসো হৃদয়ে আমার;",
                        "দূর থেকে দূরে — আরও দূরে যুবকের সাথে তুমি যেয়ো নাকো আর।"
                    ],
                    "seed": 317,
                    "author": "জীবনানন্দ দাশ"
                },
                {
                    "title": "আকাশলীনা 2",
                    "lines": [
                        "সুরঞ্জনা, ঐখানে যেয়ো নাকো তুমি, বোলো নাকো কথা ঐ যুবকের সাথে;",
                        "ফিরে এসো সুরঞ্জনা: নক্ষত্রের রুপালি আগুন ভরা রাতে;",
                        "ফিরে এসো এই মাঠে, ঢেউয়ে; ফিরে এসো হৃদয়ে আমার;",
                        "দূর থেকে দূরে — আরও দূরে যুবকের সাথে তুমি যেয়ো নাকো আর।"
                    ],
                    "seed": 3177,
                    "author": "জীবনানন্দ দাশ"
                }
            ]
        },
        {
            "id": "samaresh-jalsha-quote",
            "title": "জলসা",
            "description": "সত্য অনুভূতির সঙ্গে মিলেমিশে মানুষের অভ্যন্তরীণ অবস্থা অনুভব করিয়ে দেওয়া কবিতা সংকলন",
            "coverSeed": 55,
            "author": "সমরেশ মজুমদার",
            "book": "জলসা",
            "poems": [
                {
                    "title": "অপ্রকাশিত কবিতা থেকে একটি কথা",
                    "lines": [
                        "মনোরমা পাশ ফিরে তাঁর শীর্ণ হাত বাড়িয়ে নাতনিকে জড়িয়ে ধরলেন ।",
                        "লোমচর্ম শরীরেও যে উত্তাপ থাকে তা দীপাবলীকে আশ্বস্ত করলো ।",
                        "তার মনে হলো বাইরের পুরুষদের সঙ্গে লড়াই করলেই যা পাওয়া যায়না",
                        "নিজের মনের অন্ধকার সরালে তা পাওয়ার পথ পরিষ্কার হয় ।"
                    ],
                    "seed": 423,
                    "author": "সমরেশ মজুমদার"
                }
            ]
        }
    ]
;

// Helper function to get all poems across all books
export function getAllPoems(): Poem[] {
  return books.flatMap(book => book.poems);
}

// Helper function to get poems for a specific book by ID
export function getPoemsByBookId(bookId: string): Poem[] {
  const book = books.find(b => b.id === bookId);
  return book ? book.poems : [];
}

// Helper function to get a book by ID
export function getBookById(bookId: string): Book | undefined {
  return books.find(b => b.id === bookId);
}
