/** Dummy gallery items for admin (no API). */

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export const DUMMY_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Service interior",
    caption: "Zonă de așteptare și recepție.",
    imageUrl: "https://placehold.co/800x500/e2e8f0/64748b?text=Service+interior",
    order: 1,
    createdAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "gal-2",
    title: "Lift auto",
    caption: "Echipament profesional pentru revizii.",
    imageUrl: "https://placehold.co/800x500/e2e8f0/64748b?text=Lift+auto",
    order: 2,
    createdAt: "2025-01-16T11:00:00.000Z",
  },
  {
    id: "gal-3",
    title: "Schimb anvelope",
    caption: "Montaj și echilibrare anvelope.",
    imageUrl: "https://placehold.co/800x500/e2e8f0/64748b?text=Schimb+anvelope",
    order: 3,
    createdAt: "2025-01-17T09:00:00.000Z",
  },
  {
    id: "gal-4",
    title: "Spălătorie auto",
    caption: "Spălare și detailing.",
    imageUrl: "https://placehold.co/800x500/e2e8f0/64748b?text=Spalatorie",
    order: 4,
    createdAt: "2025-01-18T14:00:00.000Z",
  },
  {
    id: "gal-5",
    title: "Echipă DTL",
    caption: "Echipa noastră la lucru.",
    imageUrl: "https://placehold.co/800x500/e2e8f0/64748b?text=Echipa+DTL",
    order: 5,
    createdAt: "2025-01-20T08:00:00.000Z",
  },
];
