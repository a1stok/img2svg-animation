# Improvement: Cloudinary Asset Storage

## Overview

Add Cloudinary storage for uploaded source images, generated SVGs, and exported animation videos so user assets can persist beyond the local browser session.

## Implementation path

- Upload source images to Cloudinary after client-side validation.
- Store generated SVG output as a Cloudinary raw asset or versioned file.
- Store exported animation videos in Cloudinary video storage when video export is added.
- Keep local preview behavior fast, but save Cloudinary public IDs/URLs for later reuse, sharing, and download history.
