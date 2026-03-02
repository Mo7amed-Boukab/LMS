export const getMediaUrl = (path: string | undefined | null) => {
  if (!path) return "/images/placeholder-course.jpg";
  
  // Normalize backward slashes to forward slashes (useful for Windows paths)
  let normalizedPath = path.replace(/\\/g, "/");
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // If the path contains '/uploads/', always use the current apiUrl origin to avoid localhost issues
  // when deployed, because the database might have saved records with http://localhost:4000
  if (normalizedPath.includes("/uploads/")) {
     const urlPart = normalizedPath.split('/uploads/')[1];
     if (urlPart) {
        return `${apiUrl}/uploads/${urlPart}`;
     }
  }

  // If it's already an absolute URL (like YouTube, external image)
  if (normalizedPath.startsWith("http")) {
    return normalizedPath;
  }
  
  // Ensure path starts with / but doesn't have double //
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  
  // If the path already contains the apiUrl, don't duplicate it
  if (cleanPath.startsWith(apiUrl.replace("http://", "/").replace("https://", "/"))) {
    return `${apiUrl.split("://")[0]}://${cleanPath.replace(/^\//, '')}`;
  }

  return `${apiUrl}${cleanPath}`;
};
