# Poll Everywhere Setup for CEHDR Community Engagement Draft 3

Draft 3 contains three Poll Everywhere embed slots:

1. Clickable Image Heatmap
2. Community Priority Ranking
3. Community Knowledge Quiz

The slots show branded preview states until live Response Link URLs are added.

## Shared Settings

Use these settings for all three activities:

- Audience or participation restriction: Everyone
- Participant registration: Not required
- Anonymity: On
- Participant screen names: Off
- Responses per participant: One, unless the quiz requires one answer per question
- Show Responses: On when visitors should see live aggregate results
- Response Link: Enabled
- Availability dates: Leave empty for an always-on webpage activity, or add dates for a limited campaign

Avoid collecting names, email addresses, precise home locations, health diagnoses, or other sensitive information.

## Clickable Image Heatmap

Suggested prompt:

> Which CEHDR community activity would you be most interested in joining?

1. Create a Clickable Image activity.
2. Upload `https://sites.uci.edu/cehdr/files/2026/07/Community-Engagement-Model-CEM.png`.
3. Define five clickable regions around Talk Show Model, Game Show, Conversation Cafe, Data Walk, and Citizen Panels.
4. Do not mark a correct answer.
5. Select the heatmap result visualization.
6. Limit visitors to one selection.

## Priority Ranking

Suggested prompt:

> Rank the environmental health issues that should receive the most attention.

Use these controlled choices:

- Air Pollution
- Extreme Heat
- Poor Water Quality
- Wildfires and Smoke
- Severe Weather and Flooding
- Drought

Enable the aggregate ranking result so visitors can see the current community order.

## Community Knowledge Quiz

Create a five-question self-paced activity using the questions already present in Draft 1. Mark the correct answer for each question and include the existing feedback as the answer explanation.

Poll Everywhere Response Links do not support Competition leaderboards. A public, self-paced quiz can show correctness and response totals, but a points leaderboard requires a facilitated live Competition.

## Add the Response URLs

For each Poll Everywhere activity:

1. Open the activity.
2. Select **Share**.
3. Enable **Response Link**.
4. Select the embed option or copy the generated Response Link URL.
5. In `CommunityEngagement_Draft3.html`, find the matching `data-response-url=""` attribute.
6. Paste the HTTPS Response Link URL between the quotation marks.

Example:

```html
data-response-url="https://your-poll-everywhere-response-link"
```

The page script will hide the preview state and load the activity automatically.

## WordPress Check

Paste the completed page into a WordPress Custom HTML block. Confirm that the editor preserves the Poll Everywhere iframe. If WordPress removes it, an administrator may need to allow the Poll Everywhere embed domain.

Test the final page while logged out of both WordPress and Poll Everywhere. Submit one response on desktop and mobile, confirm that no login is requested, and verify that live aggregate results appear as intended.
