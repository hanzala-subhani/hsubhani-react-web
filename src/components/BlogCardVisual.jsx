import { blogBannerFallback, getPostBannerUrl, resolvePostBannerUrl } from '../lib/blogUtils'

/**
 * @param {{ post?: object, className?: string, dateBadge?: import('react').ReactNode, forceLogoPanel?: boolean }} props
 */
export default function BlogCardVisual({ post, className = '', dateBadge = null, forceLogoPanel = false }) {
  const isLogoFallback = forceLogoPanel || !resolvePostBannerUrl(post)
  const bannerUrl = isLogoFallback ? blogBannerFallback : getPostBannerUrl(post)
  const label = post?.title ? `Cover image for ${post.title}` : 'Blog post cover'

  return (
    <div
      className={`blog-card-visual blog-card-visual--banner${isLogoFallback ? ' blog-card-visual--logo-fallback blog-visual-logo-bg' : ''}${className ? ` ${className}` : ''}`}
    >
      {isLogoFallback ? (
        <img src={bannerUrl} alt="" className="blog-card-logo-mark" aria-hidden="true" />
      ) : (
        <img src={bannerUrl} alt="" className="blog-card-visual-img" aria-hidden="true" />
      )}
      <span className="visually-hidden">{label}</span>
      {dateBadge}
    </div>
  )
}
