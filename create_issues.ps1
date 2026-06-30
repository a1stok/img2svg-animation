$ErrorActionPreference = "Stop"
$env:GITHUB_TOKEN = ""

$repo = "a1stok/img2svg-animation"
$prdNumber = 30

function CreateSubIssue($title, $body) {
    Write-Host "Creating: $title"
    $issueUrl = gh issue create --title $title --body $body --repo $repo
    $issueNumber = ($issueUrl -split "/")[-1]
    
    $issueId = gh api repos/$repo/issues/$issueNumber --jq '.id'
    
    Write-Host "Attaching issue $issueNumber (ID: $issueId) to PRD $prdNumber"
    gh api -X POST "repos/$repo/issues/$prdNumber/sub_issues" -f sub_issue_id=$issueId
}

$body1 = @"
## Parent PRD
#$prdNumber

## What to build
Update the application's global theme to use a Deep Midnight (`#05070A`) background with Electric Blue accents. Remove the generic hero section and clean up the typography to be more minimal and modern.

## Acceptance criteria
- [ ] Theme variables updated in CSS.
- [ ] Old hero component removed.
- [ ] Typography and layout adjusted for the new clean look.
"@
CreateSubIssue "Implement Midnight Blue aesthetic and layout cleanup" $body1

$body2 = @"
## Parent PRD
#$prdNumber

## What to build
Integrate the Cult UI `DitherImageFrame` component into the `ImageUploader` dropzone. Use the `ink-vid.mp4` video paused at 15 seconds as the source for the dither effect, and overlay it with a dark blue tint.

## Acceptance criteria
- [ ] `DitherImageFrame` adapted for React Native / Vite.
- [ ] Video element correctly styled and paused at 15s.
- [ ] Hover scaling and borderless layout implemented.
"@
CreateSubIssue "Add DitherImageFrame with ink-video background to ImageUploader" $body2

$body3 = @"
## Parent PRD
#$prdNumber

## What to build
Create a `BackgroundAnimation` component that loads the raw `traced-graphic.svg` string and uses Anime.js to draw the paths. Place it fixed at the bottom of the page behind the content to demonstrate the app's capability.

## Acceptance criteria
- [ ] `BackgroundAnimation` component created.
- [ ] Anime.js draws paths over 10 seconds.
- [ ] Placed at bottom of `_index.tsx` without forcing scrollbars.
"@
CreateSubIssue "Add BackgroundAnimation component with SVG tracing demo" $body3

$body4 = @"
## Parent PRD
#$prdNumber

## What to build
Add convenient export buttons to the `SvgPlayer` component, including "Copy SVG", "Download SVG", and "Download HTML". Additionally, fix the Flash of Unstyled Content (FOUC) by fading in the SVGs after Anime.js applies the `stroke-dasharray`.

## Acceptance criteria
- [ ] Copy to clipboard and download buttons implemented.
- [ ] HTML export bundles the SVG and Anime.js logic.
- [ ] SVGs fade in smoothly, preventing FOUC.
"@
CreateSubIssue "Fix FOUC and add Copy/Download buttons to SvgPlayer" $body4

Write-Host "All sub-issues created!"
