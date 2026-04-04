// Simple in-memory store for published updates (demo purposes)
export interface PublishedUpdate {
  dossierId: string;
  date: string;
  status: string;
  nextStep: string;
  pushSent: boolean;
}

const publishedUpdates: PublishedUpdate[] = [];

export const addPublishedUpdate = (update: PublishedUpdate) => {
  publishedUpdates.push(update);
};

export const getPublishedUpdates = (dossierId: string): PublishedUpdate[] => {
  return publishedUpdates.filter((u) => u.dossierId === dossierId);
};
