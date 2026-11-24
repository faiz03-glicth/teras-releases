# Teras (Prod): stable builds

Teras is the stable line, recommended for everyday training. A build reaches Prod only after it has run on
SandBoxTeras first. The app is named **ProdTeras** on your phone.

Prod and [SandBoxTeras](../sandbox/README.md) are separate apps: each keeps its own workouts, and syncing
between them is not set up yet.

Releases: tags starting with `prod-` (for example `prod-v0.1.7`) on the [releases page](https://github.com/faiz03-glicth/teras-releases/releases).

## History

### 0.1.8 (build 6), 24 November 2026
Everything from SandBoxTeras 0.7.2:
- Live workout: supersets, drop sets and pyramids (spotted for you, or made from the menu), weight per hand, bodyweight sets, hold to reorder, rest timer from the clock.
- History Workout with search; repeat any past workout; save a workout as a routine.
- Import from Hevy, Strong or FitNotes; export CSV, back up and restore.
- Training stats: estimated 1RM, hard sets, recovery, bodyweight trend and goal, effort per set.
- Edit share pictures; 53 new exercises with Smith machine and BOSU ball; rest alarm at full volume.

### 0.1.7 (build 5), 21 November 2026
The first Prod release, with everything from SandBoxTeras 0.7.1:
- Teras has its own sign-in with Google or Apple.
- Smoother exercise search; Bahasa Melayu fixes on the month card.
- Needs Android 8 or later. The storage permission is asked only on Android 10 and older.
- Prod builds carry no test hooks, are not debuggable, and are checked for leaked keys and by a security scan.
