export const createSafeUrlFromTitle = (title: string) => {
  // Convert to lowercase and remove special characters and spaces
  const safeTitle = title.toLowerCase().replace(/[^\w\s]/g, '');

  // Replace spaces with hyphens
  return safeTitle.replace(/\s+/g, '_').replace(/\+/g, '_');
};
