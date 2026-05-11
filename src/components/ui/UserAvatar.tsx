import { useState, useEffect } from "react";
import defaultAvatar from "../../assets/default-user-avatar.webp";
import { cn } from "../../lib/utils";

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  className?: string;
  alt?: string;
}

export function UserAvatar({ photoURL, name, className, alt }: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>(photoURL || defaultAvatar);

  useEffect(() => {
    setImgSrc(photoURL || defaultAvatar);
  }, [photoURL]);

  return (
    <img
      src={imgSrc}
      alt={alt || name || "User avatar"}
      className={cn("rounded-full object-cover transition-opacity duration-300", className)}
      onError={() => {
        if (imgSrc !== defaultAvatar) {
          setImgSrc(defaultAvatar);
        }
      }}
    />
  );
}
