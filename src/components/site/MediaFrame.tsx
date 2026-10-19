import Image from "next/image";
import type { Media } from "@/content/home";

/**
 * Shows the robot photo when `media.src` is set, otherwise a neutral
 * placeholder of the same size. The placeholder path hint is dev-only.
 */
export default function MediaFrame({
  media,
  aspect = "aspect-[4/3]",
  priority = false,
  sizes = "100vw",
  className = "",
}: {
  media: Media;
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-paper ${aspect} ${className}`}
      data-header-dark={media.src ? "" : undefined}
    >
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div role="img" aria-label={media.alt} className="absolute inset-0">
          {process.env.NODE_ENV !== "production" && (
            <span className="absolute bottom-3 left-3 font-mono text-[11px] text-ink-muted">
              placeholder: src/content/home.ts
            </span>
          )}
        </div>
      )}
    </div>
  );
}
