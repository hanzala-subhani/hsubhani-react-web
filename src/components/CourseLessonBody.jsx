export function buildLessonNav(course) {
  const topics = Array.isArray(course?.topics) ? course.topics : []
  const flat = []
  topics.forEach(topic => {
    const lessons = Array.isArray(topic.lessons) ? topic.lessons : []
    lessons.forEach(lesson => {
      flat.push({ topic, lesson })
    })
  })
  return flat
}

/** Resolved video URL from common API field names. */
export function lessonYoutubeSource(lesson) {
  if (!lesson) return ''
  const u = lesson.youtube_url || lesson.video_url || lesson.video_link || lesson.embed_url || ''
  return typeof u === 'string' ? u.trim() : ''
}

/** First non-empty text/html field from typical Laravel / CMS lesson payloads. */
export function lessonTextContent(lesson) {
  if (!lesson) return ''
  const candidates = [
    lesson.content,
    lesson.body,
    lesson.description,
    lesson.content_html,
    lesson.html,
    lesson.lesson_content,
    lesson.text,
    lesson.rich_text,
    lesson.markdown,
  ]
  for (const c of candidates) {
    if (c != null && String(c).trim() !== '') return String(c)
  }
  return ''
}

export function lessonHasDisplayContent(lesson) {
  if (!lesson) return false
  const yt = lessonYoutubeSource(lesson)
  const isYoutubeType =
    lesson.content_type === 'youtube' ||
    lesson.content_type === 'video' ||
    (yt && /youtu\.be|youtube\.com/i.test(yt))
  if (isYoutubeType && yt) return true
  return lessonTextContent(lesson).length > 0
}

function parseYoutubeId(url) {
  if (!url || typeof url !== 'string') return ''
  const u = url.trim()
  const m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : ''
}

export function CourseLessonBody({ lesson }) {
  if (!lesson) return <p className="muted">Select a lesson.</p>
  const ytUrl = lessonYoutubeSource(lesson)
  const isYoutube =
    (lesson.content_type === 'youtube' || lesson.content_type === 'video' || /youtu\.be|youtube\.com/i.test(ytUrl)) &&
    ytUrl
  if (isYoutube) {
    const id = parseYoutubeId(ytUrl)
    if (!id) return <p className="muted">Could not read this video URL.</p>
    return (
      <div className="cdetail-yt-wrap">
        <iframe
          title={lesson.title || 'Video'}
          src={`https://www.youtube.com/embed/${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  const raw = lessonTextContent(lesson)
  if (!raw) return <p className="muted">No lesson content published yet.</p>
  if (/<[a-z][\s\S]*>/i.test(String(raw))) {
    return (
      <div
        className="post-content post-content--html idetail-answer"
        dangerouslySetInnerHTML={{ __html: String(raw) }}
      />
    )
  }
  return <div className="idetail-answer"><p>{raw}</p></div>
}
