# Sleepwalk gallery refresh — November 6, 2026

All gallery images are actual Unity runtime captures. PNG sources were resized to at most 1600 × 1200 and encoded as WebP, without changing their contents. The Unity project was read only.

Project: `Erica_Erika_Dreamer/wwk`

| Website image | Original capture |
| --- | --- |
| sleepwalk-rolling-route | Rolling Girl visualization folder / level03-restored-solved-map.png |
| sleepwalk-rolling-finale | Rolling Girl visualization folder / ending-final.png |
| sleepwalk-cross-tutorial | ValidationOutput/RefrainTutorial/cross-blocks.png |
| sleepwalk-refrain-route | Temp/Level04Validation/level04-play-initial.png |
| sleepwalk-game-cover-20261106 | Fresh capture / PortfolioCapture/cover-home.png |
| sleepwalk-recollection-ribbons-20261106 | Fresh capture / PortfolioCapture/Recollection/circle-1-settled.png |
| sleepwalk-recollection-joining-20261106 | Fresh capture / PortfolioCapture/Recollection/heart-before-joining.png |
| sleepwalk-recollection-finale-20261106 | Fresh capture / PortfolioCapture/Recollection/green-zoom-finished.png |

Foundation and Reflection use the previously captured project images. Rolling Girl captures came from the visualization output associated with its development chat on November 2, 2026.

## Fresh runtime captures

The November 6 images were rendered in Unity 6000.0.59f2 from a fresh isolated copy of the current `wwk` Assets, Packages and ProjectSettings. The source Epilogue runtime and scene were last modified November 5 at 10:01; they include the revised quieter UI, smaller initial framing, smooth heart transformations and final zoom. The original project was not modified or opened.

The isolated copy is `C:/Users/ERICA/Documents/Codex/sleepwalk-capture-nov6`. A capture-only test loads the actual cover scene and renders its camera at 1920×1080. Existing `CompleteRouteBuildsHeartClosesGapAndSpreadsColor` and `CompletedGreenHeartGentlyZoomsToOriginalSize` tests play the final level through its real runtime methods and render the route/finale cameras at 1600×1000. All three selected tests passed (`portfolio-tests.xml`); the two Recollection tests passed again (`recapture-tests.xml`) after redirecting their output from Unity's disposable Temp folder to PortfolioCapture. No gameplay code, scene or asset changes were made in the copy. Development-only packages were omitted from the copy's manifest.

All four final WebP files were visually inspected together. The new in-game cover belongs first in the gallery; it is distinct from the supplied promotional cover used on the homepage and detail header. Old Recollection captures are no longer used by the refreshed gallery.

The project copy was checked against the Foundation/Reflection, Rolling Girl, Unhappy Refrain, Recollection and scene-transition development chats, plus the current project files. It describes Erica's gameplay implementation, technical design, tutorial and finale work. The page intentionally keeps the contribution statement concise rather than detailing the full team division.
