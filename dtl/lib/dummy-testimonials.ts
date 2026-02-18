/** Types for testimonials. Data from DB/API. */

export interface TestimonialItem {
  id: string;
  author: string;
  role?: string;
  text: string;
  rating?: number;
  createdAt: string;
  visible: boolean;
}
