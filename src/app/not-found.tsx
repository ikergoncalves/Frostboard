import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fb-not-found">
      <span className="fb-not-found__code">404</span>
      <h1 className="fb-not-found__title">Page not found</h1>
      <p className="fb-not-found__desc">
        The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Link href="/dashboard" className="fb-not-found__link">
        Back to dashboard
      </Link>
    </div>
  );
}
