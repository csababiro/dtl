/** Types for gallery items. Data from DB/API. */

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}
