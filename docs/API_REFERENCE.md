# API Reference — Hanzala Subhani Web / Next.js

Backend: **Laravel API v1**  
All paths below are relative to the API base URL.

| Environment | Base URL |
|-------------|----------|
| Local | `http://127.0.0.1:8000/api/v1` |
| Production | `https://blog-api.hsubhani.com/api/v1` |

**Media origin** (blog/course images): derived from API host, e.g. `https://blog-api.hsubhani.com`  
Relative paths like `storage/...` resolve to `{SERVER_API_ORIGIN}/storage/...`.

---

## Conventions

### Request headers

| Header | When |
|--------|------|
| `Accept: application/json` | All requests |
| `Content-Type: application/json` | POST / PUT with JSON body |
| `Authorization: Bearer {token}` | Authenticated course studio routes |

### Standard response envelope

Most endpoints return:

```json
{
  "success": true,
  "message": "Optional message",
  "data": { }
}
```

Client helpers (`apiGet`, `apiPost`, `apiGetAuth`, `apiPostAuth`) return **`data`** only and throw if `success === false` or HTTP status is not OK.

**Exception:** `POST courses/topics` uses `apiPostRaw` — the client reads the **full** JSON body (see endpoint #22).

### Error response

```json
{
  "success": false,
  "message": "Human-readable error"
}
```

HTTP 4xx/5xx may also return `{ "message": "..." }` without `success`.

### Auth token (course studio)

- Obtained from `POST auth/login` or `POST auth/register` (`data.token`).
- Store in client (this SPA uses `localStorage` key `course_user_token`).
- Send as `Authorization: Bearer {token}` on protected routes.

---

## 1. Authentication

### 1.1 Login

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/auth/login` |
| **Auth** | No |

**Payload**

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Response `data`**

```json
{
  "token": "1|plainTextToken...",
  "user": {
    "id": 1,
    "name": "Hanzala",
    "email": "user@example.com"
  }
}
```

---

### 1.2 Register

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/auth/register` |
| **Auth** | No |

**Payload**

```json
{
  "name": "Hanzala Subhani",
  "email": "user@example.com",
  "password": "secret"
}
```

**Response `data`** — same shape as login (`token`, `user`).

---

### 1.3 Current user

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/auth/me` |
| **Auth** | Bearer |

**Payload** — none.

**Response `data`** — user object (e.g. `id`, `name`, `email`).

---

### 1.4 Logout

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/auth/logout` |
| **Auth** | Bearer |

**Payload**

```json
{}
```

**Response `data`** — typically empty or success message.

---

## 2. Blog

### 2.1 List posts (paginated)

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/blog-list` |
| **Auth** | No |

**Payload**

```json
{
  "per_page": 15,
  "page": 1,
  "category_id": 0,
  "search": "optional search string"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `per_page` | number | 1–50, default 15 |
| `page` | number | Optional, > 1 for next pages |
| `category_id` | number | Optional filter |
| `search` | string | Optional full-text filter |

**Response `data`** — Laravel-style paginator or array:

```json
{
  "data": [
    {
      "id": 1,
      "slug": "my-post",
      "title": "Post title",
      "content": "<p>HTML body</p>",
      "featured_image": "blogs/featured.jpg",
      "category_id": 2,
      "category": { "id": 2, "name": "Laravel" },
      "author": { "name": "Hanzala Subhani", "role": "author" },
      "created_at": "2026-01-15T10:00:00.000000Z",
      "updated_at": "2026-01-16T10:00:00.000000Z"
    }
  ],
  "current_page": 1,
  "last_page": 3,
  "per_page": 15,
  "total": 42
}
```

Client normalizes to `{ items: BlogRow[], meta: { current_page, last_page, total, per_page } | null }`.

---

### 2.2 Get post by ID

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/blog-list/{id}` |
| **Auth** | No |

**Payload** — none (id in path).

**Response `data`** — single blog row (same fields as list item, includes full `content` HTML).

---

### 2.3 Get post by slug

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/blog-list/slug/{slug}` |
| **Auth** | No |

**Payload** — none.

**Response `data`** — single blog row.  
**Fallback:** if slug route missing, client may resolve `post-{id}` or scan list pages.

---

## 3. Interview (public web)

### 3.1 Category tree

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/web/interview-categories` |
| **Auth** | No |

**Payload** — none.

**Response `data`** — array of parent categories:

```json
[
  {
    "id": 1,
    "name": "Technical",
    "slug": "technical",
    "questions_count": 120,
    "subcategories": [
      {
        "id": 10,
        "name": "Laravel",
        "slug": "laravel",
        "questions_count": 45
      }
    ]
  }
]
```

Alternate shape: `children` instead of `subcategories`; counts may be `contents_count`.

---

### 3.2 Questions by subcategory

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/web/interview-categories/{subcategoryId}/questions` |
| **Auth** | No |

**Payload** — none (`subcategoryId` in path).

**Response `data`**

```json
{
  "category": { "id": 10, "name": "Laravel", "slug": "laravel" },
  "total": 45,
  "questions": [
    {
      "id": 101,
      "slug": "what-is-mvc",
      "title": "What is MVC?",
      "description": "Short or HTML answer preview"
    }
  ]
}
```

---

### 3.3 Interview detail (single question + navigation)

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/web/interview-detail` |
| **Auth** | No |

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `cat` | string | Parent category slug |
| `sub` | string | Subcategory slug |
| `q` | string | 0-based index in subcategory question list |
| `question_id` | string/number | Question primary key |

**Example**

```
GET /web/interview-detail?cat=technical&sub=laravel&q=0&question_id=101
```

**Response `data`**

```json
{
  "category": { "id": 1, "name": "Technical", "slug": "technical" },
  "position": {
    "q": "What is MVC?",
    "index": 0,
    "serial": 1,
    "total": 45
  },
  "navigation": {
    "prev_question_id": null,
    "next_question_id": 102
  },
  "question": {
    "id": 101,
    "title": "What is MVC?",
    "slug": "what-is-mvc",
    "description": "<p>Full HTML answer</p>"
  }
}
```

---

### 3.4 Record interview view

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/interview-list/{questionId}/view` |
| **Auth** | No |

**Payload**

```json
{}
```

**Response** — success envelope; errors are ignored in the SPA (fire-and-forget analytics).

---

## 4. Courses — public catalog

### 4.1 Course categories (tree)

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/course-categories` |
| **Auth** | No |

**Payload** — none.

**Response `data`** — nested category tree:

```json
[
  {
    "id": 1,
    "name": "Web Development",
    "slug": "web-development",
    "courses_count": 5,
    "subcategories": [
      {
        "id": 2,
        "name": "Laravel",
        "slug": "laravel",
        "courses_count": 3
      }
    ]
  }
]
```

Children may appear as `children` instead of `subcategories`.

---

### 4.2 Full catalog (categories + courses)

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/web/course-catalog` |
| **Auth** | No |

**Payload**

```json
{
  "courses_per_category": 500,
  "include_unpublished": true
}
```

| Field | Type | Notes |
|-------|------|-------|
| `courses_per_category` | number | Max courses embedded per category |
| `include_unpublished` | boolean | Include draft/unpublished courses |

**Response `data`** — array of category nodes, each optionally containing nested `courses[]`:

```json
[
  {
    "id": 1,
    "name": "Web Development",
    "slug": "web-development",
    "subcategories": [],
    "courses": [
      {
        "id": 10,
        "title": "Laravel Masterclass",
        "slug": "laravel-masterclass",
        "description": "HTML or plain text",
        "thumbnail": "courses/thumb.jpg",
        "is_free": true,
        "price_amount": 0,
        "currency": "USD",
        "difficulty": "beginner",
        "status": "published"
      }
    ]
  }
]
```

---

### 4.3 List courses (paginated)

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/courses` |
| **Auth** | No |

**Query parameters**

| Param | Type | Notes |
|-------|------|-------|
| `category_id` | number | Optional filter |
| `page` | number | Page number |
| `per_page` | number | Max 50, default 12 |

**Example:** `GET /courses?category_id=2&page=1&per_page=12`

**Response `data`** — paginator or array:

```json
{
  "data": [ { "id": 10, "title": "...", "slug": "...", "thumbnail": "..." } ],
  "current_page": 1,
  "last_page": 2,
  "total": 18
}
```

---

### 4.4 Course by slug

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/courses/slug/{slug}` |
| **Auth** | No |

**Response `data`** — full course including nested topics/lessons when available:

```json
{
  "id": 10,
  "title": "Laravel Masterclass",
  "slug": "laravel-masterclass",
  "description": "<p>...</p>",
  "thumbnail": "courses/thumb.jpg",
  "is_free": true,
  "price_amount": null,
  "currency": "USD",
  "difficulty": "beginner",
  "topics": [
    {
      "id": 1,
      "title": "Introduction",
      "lessons": [
        {
          "id": 100,
          "title": "Welcome",
          "content_type": "text",
          "content": "<p>Lesson HTML</p>",
          "youtube_url": "",
          "duration_seconds": 300
        }
      ]
    }
  ]
}
```

---

### 4.5 Course by ID

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/courses/{courseId}` |
| **Auth** | No |

**Response `data`** — same shape as course by slug.

---

### 4.6 Course topics + lesson shell (POST)

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/courses/topics` |
| **Auth** | No |

**Payload**

```json
{
  "course_id": 10
}
```

**Full HTTP JSON body** (not only `data`):

```json
{
  "success": true,
  "message": "OK",
  "course_id": 10,
  "data": [
    {
      "id": 1,
      "title": "Introduction",
      "lessons": [
        { "id": 100, "title": "Welcome", "content_type": "text" }
      ]
    }
  ]
}
```

UI merges this with `GET /courses/{id}` for full lesson bodies (`content`, `youtube_url`, etc.).

---

### 4.7 Single public lesson

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/courses/{courseId}/lessons/{lessonId}` |
| **Auth** | No |

**Response `data`** — lesson object, or `{ "lesson": { ... } }` (client unwraps `.lesson`).

```json
{
  "id": 100,
  "title": "Welcome",
  "content_type": "text",
  "content": "<p>HTML</p>",
  "youtube_url": "",
  "duration_seconds": 300
}
```

---

## 5. Courses — authenticated studio

All routes below require `Authorization: Bearer {token}`.

### 5.1 My courses

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/user/courses` |
| **Auth** | Bearer |

**Response `data`** — array of course summaries owned by the user.

---

### 5.2 My course (single)

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/user/courses/{courseId}` |
| **Auth** | Bearer |

**Response `data`** — single course object.

---

### 5.3 Create course

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/user/courses` |
| **Auth** | Bearer |

**Payload**

```json
{
  "category_id": 2,
  "title": "Laravel APIs",
  "slug": "laravel-apis",
  "description": "<p>HTML description</p>",
  "is_free": true,
  "price_amount": null,
  "currency": "USD",
  "difficulty": "beginner",
  "status": "draft"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `category_id` | number | Required |
| `title` | string | Required |
| `slug` | string | URL-safe |
| `description` | string | HTML allowed |
| `is_free` | boolean | |
| `price_amount` | number \| null | null when free |
| `currency` | string | e.g. `USD` |
| `difficulty` | string | e.g. `beginner`, `intermediate`, `advanced` |
| `status` | string | e.g. `draft`, `published` |

**Response `data`** — created course record.

---

### 5.4 List topics (studio)

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/user/courses/{courseId}/topics` |
| **Auth** | Bearer |

**Response `data`** — array of topics.

---

### 5.5 Create topic

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/user/courses/{courseId}/topics` |
| **Auth** | Bearer |

**Payload**

```json
{
  "title": "Getting started",
  "description": "Optional topic intro"
}
```

**Response `data`** — created topic.

---

### 5.6 List lessons (studio)

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/user/courses/{courseId}/topics/{topicId}/lessons` |
| **Auth** | Bearer |

**Response `data`** — array of lessons.

---

### 5.7 Create lesson

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/user/courses/{courseId}/topics/{topicId}/lessons` |
| **Auth** | Bearer |

**Payload**

```json
{
  "title": "Lesson 1",
  "content_type": "text",
  "content": "<p>HTML lesson body</p>",
  "youtube_url": "",
  "duration_seconds": 600
}
```

| Field | Type | Notes |
|-------|------|-------|
| `content_type` | string | `text` or `youtube` |
| `youtube_url` | string | Used when `content_type` is `youtube` |
| `duration_seconds` | number \| null | Optional |

**Response `data`** — created lesson.

---

## 6. Endpoints not used by current SPA routes

These exist in mappers/comments or legacy code but are **not** called from active pages after nav cleanup. Keep for Next.js if needed:

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/interview-categories` | Alternate category tree (`children` shape) |
| `GET` | `/interview-list/{id}` | Single interview content by ID |

---

## 7. No backend API

| Feature | Behavior |
|---------|----------|
| **Contact form** | Client-side validation only; no API call |

---

## 8. Next.js integration

### Environment variables

```env
# .env.local
NEXT_PUBLIC_API_V1_BASE=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_SERVER_API_ORIGIN=http://127.0.0.1:8000
```

Production:

```env
NEXT_PUBLIC_API_V1_BASE=https://blog-api.hsubhani.com/api/v1
NEXT_PUBLIC_SERVER_API_ORIGIN=https://blog-api.hsubhani.com.com
```

### Example fetch helper (App Router)

```ts
const API_V1 = process.env.NEXT_PUBLIC_API_V1_BASE!;

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_V1}/${path.replace(/^\//, '')}`, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 60 }, // adjust per route
  });
  const json: ApiEnvelope<T> = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? res.statusText);
  }
  return json.data;
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_V1}/${path.replace(/^\//, '')}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json: ApiEnvelope<T> = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? res.statusText);
  }
  return json.data;
}
```

### Suggested Next.js route mapping

| Next.js route | APIs |
|---------------|------|
| `/blog` | `POST /blog-list` |
| `/blog/[slug]` | `GET /blog-list/slug/{slug}` |
| `/interview` | `GET /web/interview-categories` |
| `/interview/[cat]/[sub]` | `GET /web/interview-categories/{id}/questions` |
| `/interview/detail` | `GET /web/interview-detail?...`, `POST /interview-list/{id}/view` |
| `/courses` | `POST /web/course-catalog` or `GET /courses` |
| `/courses/[slug]` | `GET /courses/slug/{slug}` |
| `/courses/.../learn` | `POST /courses/topics`, `GET /courses/{id}`, `GET /courses/{id}/lessons/{lessonId}` |
| Studio (protected) | Auth + `/user/courses/*` |

### Image URL helper

```ts
const ORIGIN = process.env.NEXT_PUBLIC_SERVER_API_ORIGIN!;

export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, '');
  if (clean.startsWith('storage/')) return `${ORIGIN}/${clean}`;
  return `${ORIGIN}/storage/${clean}`;
}
```

---

## Quick index

| # | Method | Path | Auth |
|---|--------|------|------|
| 1 | POST | `/auth/login` | — |
| 2 | POST | `/auth/register` | — |
| 3 | GET | `/auth/me` | Bearer |
| 4 | POST | `/auth/logout` | Bearer |
| 5 | POST | `/blog-list` | — |
| 6 | GET | `/blog-list/{id}` | — |
| 7 | GET | `/blog-list/slug/{slug}` | — |
| 8 | GET | `/web/interview-categories` | — |
| 9 | GET | `/web/interview-categories/{id}/questions` | — |
| 10 | GET | `/web/interview-detail?cat&sub&q&question_id` | — |
| 11 | POST | `/interview-list/{id}/view` | — |
| 12 | GET | `/course-categories` | — |
| 13 | POST | `/web/course-catalog` | — |
| 14 | GET | `/courses?category_id&page&per_page` | — |
| 15 | GET | `/courses/slug/{slug}` | — |
| 16 | GET | `/courses/{id}` | — |
| 17 | POST | `/courses/topics` | — |
| 18 | GET | `/courses/{courseId}/lessons/{lessonId}` | — |
| 19 | GET | `/user/courses` | Bearer |
| 20 | GET | `/user/courses/{id}` | Bearer |
| 21 | POST | `/user/courses` | Bearer |
| 22 | GET | `/user/courses/{id}/topics` | Bearer |
| 23 | POST | `/user/courses/{id}/topics` | Bearer |
| 24 | GET | `/user/courses/{id}/topics/{topicId}/lessons` | Bearer |
| 25 | POST | `/user/courses/{id}/topics/{topicId}/lessons` | Bearer |

---

*Generated from `src/lib/api.js`, `blogApi.js`, `courseApi.js`, and page usage in this repository.*
