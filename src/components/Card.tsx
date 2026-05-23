import BookmarkButton from "./BookmarkButton";
import { isRecentlyAdded } from "../utils/dates";

interface CardProps {
  href: string;
  title: string;
  body: string;
  tags?: string[] | undefined;
  dateAdded?: string | undefined;
  slug?: string | undefined;
  category?: string | undefined;
  loading?: "eager" | "lazy";
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function Card({
  href,
  title,
  body,
  tags,
  dateAdded,
  slug,
  loading = "lazy",
}: CardProps) {
  const linkUrl = slug ? `/tools/${slug}` : href;
  const isNew = isRecentlyAdded(dateAdded, 30);

  const displayTags: string[] = tags || [];

  const domain = extractDomain(href);
  // Local favicon first; Google S2 as fallback
  const localFavicon = slug ? `/favicons/${slug}.png` : "";
  const googleFavicon = domain
    ? `https://www.google.com/s2/favicons?sz=32&domain=${domain}`
    : "";

  function handleFaviconError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (googleFavicon && img.src !== googleFavicon) {
      img.src = googleFavicon;
    } else {
      const wrap = img.closest(".card-favicon-wrap") as HTMLElement | null;
      if (wrap) wrap.style.display = "none";
    }
  }

  const hasFavicon = !!(localFavicon || googleFavicon);

  return (
    <li className="link-card">
      <a
        href={linkUrl}
        aria-label={`View details for ${title}`}
        onClick={() => {
          window.dispatchEvent(new CustomEvent("tools:save-state"));
        }}
      >
        <div className="card-header">
          {hasFavicon && (
            <span className="card-favicon-wrap" aria-hidden="true">
              <img
                className="card-favicon"
                src={localFavicon || googleFavicon}
                alt=""
                width={20}
                height={20}
                loading={loading}
                onError={handleFaviconError}
              />
            </span>
          )}
          <strong className="card-title">{title}</strong>
        </div>
        <p className="card-body-text">{body}</p>
        {(isNew || displayTags.length > 0) && (
          <div className="card-footer">
            {isNew && (
              <span
                className="tag tag-new"
                title="Recently added"
                aria-label="New"
              >
                New
              </span>
            )}
            {displayTags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </a>

      {slug && (
        <div className="card-bookmark">
          <BookmarkButton slug={slug} title={title} variant="small" />
        </div>
      )}
    </li>
  );
}
