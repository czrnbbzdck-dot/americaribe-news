# americaribe-news
AmeriCaribe News — Puerto Rico, Caribbean, United States and World News

## Article Content Model

This project currently renders a static homepage. An AmeriCaribe article is a verified editorial record that can represent reporting, analysis, investigation, data journalism, or a feature without requiring a database, API, JavaScript, or article page.

The model is documentation-only for now. The existing homepage remains static and continues to use clearly marked placeholders rather than unpublished or invented stories.

### Story types

Every article has one primary `type`:

- `breaking`: urgent, developing coverage that may be updated as facts are confirmed.
- `news`: standard reported coverage of a current event, decision, or development.
- `investigation`: evidence-based accountability or deep-dive reporting that requires extended reporting and documentation.
- `analysis`: reported interpretation and context that clearly distinguishes analysis from straight news.
- `insights`: data journalism or explanatory work built around datasets, methods, and findings.
- `feature`: narrative, cultural, profile, travel, or other enterprise coverage with a broader human or thematic focus.

### Fields

| Field | Required | Purpose and rules |
| --- | --- | --- |
| `id` | Yes | Stable unique identifier for the story. It must not change after publication. |
| `headline` | Yes | Published headline; factual, specific, and approved for the selected story type. |
| `category` | Yes | Primary homepage section, such as `Puerto Rico`, `Caribbean`, `Economy`, or `Insights`. |
| `date` | Yes | Publication or last substantive update date in ISO `YYYY-MM-DD` format. |
| `summary` | Yes | Short deck describing what the story establishes, without overstating unverified claims. |
| `status` | Yes | Editorial state: `draft`, `review`, `scheduled`, `published`, or `archived`. Only `published` content may appear publicly. |
| `subcategory` | No | More precise subject area when useful, such as `Public Health`, `Elections`, or `Data`. |
| `time` | No | Publication or update time when timing matters, especially for breaking coverage; include timezone. |
| `location` | No | Principal reporting location or geographic focus. Use `Multiple locations` when appropriate. |
| `author` | No | Byline name or approved team byline. |
| `heroImage` | No | Path or approved asset identifier for the lead image. Required before publication when the presentation calls for an image. |
| `imageCaption` | No | Caption explaining the image and its relevance. Required when `heroImage` is used. |
| `imageCredit` | No | Photographer, agency, organization, or other rights credit. Required when `heroImage` is not staff-owned or public-domain. |
| `source` | No | Named source or reporting basis supporting the article. Use multiple source entries when needed. |
| `sourceUrl` | No | Direct URL to a public source, document, dataset, or official record. Record it when the source is available online. |
| `body` | No | Complete article text, including attribution and necessary context. It must not be published while it contains unresolved placeholders. |
| `relatedStories` | No | Array of stable article IDs for relevant published stories. Do not link to unpublished or nonexistent IDs. |
| `tags` | No | Search and editorial labels used for discovery, filtering, and related coverage. |

`type` is also required and must be one of the six editorial types listed above. It identifies the article's primary journalistic treatment independently of its homepage category.

### Categories and sources

An article has one primary `category`, which determines the homepage section where it belongs. A `subcategory` refines that placement when a narrower subject is useful. An article may have multiple `tags` for discovery, but tags do not replace the primary category.

When sources are recorded, `source` should identify the person, organization, document, dataset, or reporting basis. `sourceUrl` should point directly to the relevant public source, official record, document, or dataset when one exists. Source information should preserve attribution and make verification possible; it should never imply that a source was consulted when it was not.

### Verification requirements

Before a story changes to `published`, an editor should confirm:

- the headline, summary, date, location, author, type, source, and body are present;
- factual claims are attributed or supported by primary documents and reliable reporting;
- source URLs resolve to the intended source when URLs are provided;
- image rights, caption, and credit are complete when an image is used;
- related story IDs resolve to published stories;
- the story is clearly labeled as news, analysis, investigation, insights, or feature content;
- breaking stories identify meaningful updates rather than silently changing prior reporting.

### Future article pages

An article page can use one model record to populate its title, metadata, hero media, body, sources, tags, and related-story links. The homepage can use the same record to render a story card using the category, headline, summary, date, location, image, and status fields. This keeps the current card and section structure compatible with future detail pages without changing the navigation architecture now.

### Future data-driven publishing

If the project later adopts a content pipeline, this model can become the validation contract for files or records supplied to a build step, CMS, or API. The current static HTML remains the presentation layer; future tooling can filter records by `status`, group them by `category`, sort them by `date` and `time`, and generate the existing homepage sections and article pages from the same source data.

## Article Record Workflow

The first draft article record is `articles/japan-izu-islands-level-5-landslide-warning-2026-09-21.html`. Future records should live in the same `articles/` directory, with one record per article using the fields defined above. Records remain drafts until editorial approval is complete.

The intended workflow is:

1. Receive a verified reporting package containing the approved headline, metadata, body, and source information.
2. Create or update one article record in `articles/` without changing the reusable structure in `article.html`.
3. Populate the matching `data-field` locations in an article detail page during a later static publishing step.
4. Keep `status` as `draft` or `review` until the reporting, attribution, source URLs, image rights, and editorial approval are complete.
5. Expose an article as published content only when `status` is `published` and every claim is supported by supplied verification.

The current repository uses the small browser-native loader at `js/article-loader.js`. Open a record through `article.html?id=ARTICLE-ID`; the loader fetches `articles/ARTICLE-ID.html`, parses its `data-field` values, and safely fills the reusable template. A missing ID displays `Article not specified.` and a missing or invalid record displays `Article not found.` The loader must never invent headlines, facts, quotes, sources, dates, images, or article body text.
