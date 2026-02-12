/** Dummy testimonials for admin (no API). */

export interface TestimonialItem {
  id: string;
  author: string;
  role?: string;
  text: string;
  rating?: number;
  createdAt: string;
  visible: boolean;
}

export const DUMMY_TESTIMONIAL_ITEMS: TestimonialItem[] = [
  {
    id: "test-1",
    author: "Maria P.",
    role: "Client",
    text: "Serviciu rapid și profesionist. Am rezolvat revizia în aceeași zi. Recomand!",
    rating: 5,
    createdAt: "2025-02-01T12:00:00.000Z",
    visible: true,
  },
  {
    id: "test-2",
    author: "Ion Ionescu",
    role: "Client",
    text: "Am schimbat anvelopele aici de câțiva ani. Prețuri ok, program flexibil.",
    rating: 5,
    createdAt: "2025-02-05T10:00:00.000Z",
    visible: true,
  },
  {
    id: "test-3",
    author: "Elena M.",
    text: "Mulțumesc pentru ofertă și pentru explicații. Am ales DTL pentru următoarea revizie.",
    rating: 4,
    createdAt: "2025-02-08T14:00:00.000Z",
    visible: true,
  },
  {
    id: "test-4",
    author: "Andrei S.",
    role: "Client",
    text: "Spălătoria auto e foarte bine făcută. Mașina arată ca nouă.",
    rating: 5,
    createdAt: "2025-02-10T09:00:00.000Z",
    visible: true,
  },
  {
    id: "test-5",
    author: "Cristina R.",
    text: "Programare ușoară, personal politicos. Voi reveni.",
    rating: 5,
    createdAt: "2025-02-12T11:00:00.000Z",
    visible: false,
  },
];
