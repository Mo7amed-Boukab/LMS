export const getMediaUrl = (path: string | undefined | null) => {
  if (!path) return "/images/placeholder-course.jpg";
  
  // If it's already an absolute URL
  if (path.startsWith("http")) {
    // if it points to 3000/uploads, redirect to 4000/uploads
    if (path.includes("localhost:3000/uploads")) {
      return path.replace("localhost:3000", "localhost:4000");
    }
    return path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:4000";
  
  // Ensure path starts with / but doesn't have double //
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // If the path already contains the apiUrl, don't duplicate it
  if (cleanPath.startsWith(apiUrl)) {
    return cleanPath;
  }

  return `${apiUrl}${cleanPath}`;
};
