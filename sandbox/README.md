# SandBoxTeras: test builds

SandBoxTeras is the test line of Teras. New features land here first, so it changes often and may break.
For everyday training use **[Teras (Prod)](../prod/README.md)**.

SandBoxTeras and Teras are separate apps on your phone: each keeps its own workouts. Moving data between
them is not set up yet.

Releases: tags starting with `v` (for example `v0.7.1`) on the [releases page](https://github.com/faiz03-glicth/teras-releases/releases).

## History

### 0.7.1 (build 97), 21 November 2026
- Teras has its own sign-in. After updating, sign in once more with Google or Apple.
- Exercise search: the body and muscle chips no longer redraw on every letter.
- Bahasa Melayu: the month card's weekdays, "days trained" and the 90-day median line.
- Needs Android 8 or later. The storage permission is asked only on Android 10 and older.
- Every release is checked for leaked keys and for one person reaching another's data.

### 0.7.0 (build 94), 21 November 2026
- Pick days from the training wave: tap a month for its card, or hold and slide to a day.
- Show more on Home: the feed loads 20 at a time, six months back.
- Profile: plain cover, status strip, Following, Followers and Likes row. Build number in Settings.
- Smoother exercise search, wave (worst frame 200 ms to 42 ms), cold start about 1.1 s.
- Fixed share card text, the month card on Android, and a softer Light theme.

### 0.6.3 (build 84), 13 November 2026
- Profile shows the same version as the download.
- Workout sync has a 30 second timeout and picks up where it stopped.
- Sentry and PostHog removed: Teras sends no crash reports or usage counts.

### 0.6.1, 10 November 2026
- Google sign-in said "Streak". Teras now has its own Google sign-in.

### 0.6.0 (build 82), 9 November 2026
- Body model in Settings: male or female, Polygon or Detailed.
- Simple look for slower phones. "Syncing" and "Synced" above the tab bar.
- Buy me a coffee key on Home and Profile (Android). Faster Profile, library and set saving.

### 0.5.0 (build 67), 8 November 2026
- Onboarding: six pages, and a guest button on Login.
- Profile: cover photo, Edit profile, Settings; chart as bars or a line; weekly report.
- First day of the week, Monday by default. Bodyweight card with FFMI, lean mass and body fat.
- Share one exercise as a Summary, Progress or Muscles picture. The rest alarm rings until answered.

### 0.4.1 (build 50), 7 November 2026
- Optional crash reports and four anonymous usage counts (removed again in 0.6.3).

### 0.4.0 (build 48), 2 November 2026
- Pause a workout: tap the clock; ticking a set resumes. Paused time is left out of the length.
- Live workout card: the exercise, the set, one segment per set, the exercise still.

### 0.3.0 (build 46)
- Exercise demos: 620 stills in the app; the animation downloads when you tap Play, then works offline.
- Version under Log out on Profile. Android 16 Live Update chip for the running workout.

### 0.2.0 and 0.2.1 (build 45)
- The workout in the Android notification bar and as an iPhone Live Activity.
- Rest alarm rings and vibrates with Teras closed. First-run tour with a practice workout.
- 0.2.1: the iPhone Live Activity no longer comes up black.

### 0.1.0 (build 43)
- First beta. Bahasa Melayu and English. Songket engraving on every key, theme wheel, exercise library body map.
