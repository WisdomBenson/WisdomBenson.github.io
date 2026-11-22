# WebGazer 3.5.3

This directory uses the unmodified browser bundle and MediaPipe Face Mesh runtime files from the npm package `webgazer@3.5.3` (published by the Brown WebGazer project).

- Upstream commit: [b12701dd7b6d7b00d4b8dbebf87fdec840c24999](https://github.com/brownhci/WebGazer/tree/b12701dd7b6d7b00d4b8dbebf87fdec840c24999)
- [Corresponding WebGazer source and build configuration](https://github.com/brownhci/WebGazer/archive/b12701dd7b6d7b00d4b8dbebf87fdec840c24999.tar.gz)
- [Pinned npm tarball with source and distribution files](https://registry.npmjs.org/webgazer/-/webgazer-3.5.3.tgz)
- Browser bundle SHA-256: `e276d085eb490b5ba65481c368371be03b1a358d12d95336af0a8239f643f8e0`
- [WebGazer attribution](WEBGAZER-NOTICE.md) and [GNU GPL v3](GPL-3.0.txt)
- MediaPipe Face Mesh 0.4.1633559619 by Google, [Apache License 2.0](Apache-2.0.txt). [Upstream project](https://github.com/google-ai-edge/mediapipe)

The site adapter loads the browser bundle and model after consent, inside the document in `frame.html`. It disables persistent training and automatic mouse training. It passes screen coordinates and camera samples in memory. The frame's content security policy restricts model requests to this origin. The MediaPipe runtime requires JavaScript evaluation in this frame. This policy applies only to the tracker document.
