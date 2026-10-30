# Recorded scene

The homepage now uses an actual moving video, not pointer movement or a panning still photo. Its layout is tailored to the site's subject. The previous photo animation is no longer loaded by the homepage.

## Source and license
- Creator: KATRIN BOLOVTSOVA
- Source: https://www.pexels.com/video/a-person-writing-on-a-paper-6101309/
- Pexels license: https://www.pexels.com/license/ (reviewed 30 October 2026).
- Use is illustrative; the creator and subjects do not endorse the site. The footage is recorded, not a current local observation.

## Delivery
Self-hosted H.264 MP4, 1280 × 720, 24 fps, silent, fast-start. Clip length: 10–12 seconds. Poster is a frame extracted from that clip. No external media host, library or API is needed at runtime.

## Playback
Muted inline playback with a play/pause button and actual-state label. Pauses out of view and when the browser tab is hidden. Reduced-motion and data-saving preferences start with a still frame and avoid downloading the clip until play is requested. Autoplay rejection leaves a manual play option. Failure retains the still frame and the site tools. No pointer-tracking effect.

## Verification
Check that currentTime advances, videoWidth is nonzero, play/pause controls change actual media playback, the poster and video are published, and existing site workflows pass.
