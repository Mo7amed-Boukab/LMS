export const getMediaUrl = (path: string | undefined | null) => {
  if (!path) return "/images/placeholder-course.jpg";
  
  // Normalize backward slashes to forward slashes (useful for Windows paths)
  let normalizedPath = path.replace(/\\/g, "/");
  
  // If it's already an absolute URL
  if (normalizedPath.startsWith("http")) {
    // if it points to 3000/uploads, redirect to 4000/uploads
    if (normalizedPath.includes("localhost:3000/uploads")) {
      return normalizedPath.replace("localhost:3000", "localhost:4000");
    }
    return normalizedPath;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:4000";
  
  // Ensure path starts with / but doesn't have double //
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  
  // If the path already contains the apiUrl, don't duplicate it
  if (cleanPath.startsWith(apiUrl.replace("http://", "/").replace("https://", "/"))) {
    return `${apiUrl.split("://")[0]}://${cleanPath.replace(/^\//, '')}`;
  }

  return `${apiUrl}${cleanPath}`;
};
