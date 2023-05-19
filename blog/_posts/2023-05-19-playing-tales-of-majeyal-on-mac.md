---
layout: post
title: "Playing Tales of Maj'Eyal on Mac"
tags: []

---
I recently started playing Tales of Maj'Eyal in my spare time.
I have a few hard requirements for games that I play though: they must be always-pauseable, I strongly prefer to sync saves, mods, and configs, and I can switch out of them quickly.
ToME is turn-based so is inherently always-paused.
In this post I'll describe how I set up the sync and some modifications that were necessary to be able to switch out quickly.

# Syncing stuff

I have multiple computers that I work on - mainly one in the bedroom that never moves, and a laptop in the living room.
I use Syncthing extensively to move files between all of my devices, including my phones and work laptop as well.
This means that I just need to know which paths to synchronize.

As of May 2023, the path for save games and configs is:

```
~/Library/Application Support/T-Engine
```

I simply set up yet another shared folder in syncthing - a process that takes a few minutes for a simple share like this.

# Switching out of the game

I sometimes have meetings later in the evening, and will play a little bit in between them - but I despise having a distraction like a running game in the background.
Also as the parent to small children, I often get interrupted and need to write something down or do something urgently.
Losing the ability to normally interact with my computer is a big deal, so I go out of my way to make sure I can ⌘<kbd>-Tab</kbd> out of games.
On Mac, this is best supported by using a windowed fullscreen mode - which most Mac games now default to.
ToME does not - it defaults to a fullscreen mode that doesn't allow switching with ⌘<kbd>-Tab</kbd> at all.
However, in windowed fullscreen mode pressing Escape exits the fullscreen mode which conflicts with the default keybind to dismiss windows.

To work around this, I changed the keybind to dismiss a menu to <kbd>`</kbd> and created a karabiner rule to remap <kbd>Esc</kbd> to <kbd>`</kbd> when running T-Engine.


[Karabiner Complex Modification][genesy-link]
```
{
  "title": "Tales of Maj'Eyal",
  "rules": [
    {
      "description": "Change Escape to ` to avoid windowed fullscreen issues",
      "manipulators": [
        {
          "conditions": [
            {
              "bundle_identifiers": [
                "org\\.te4\\.T-Engine"
              ],
              "type": "frontmost_application_if"
            }
          ],
          "from": {
            "key_code": "escape"
          },
          "to": [
            {
              "key_code": "grave_accent_and_tilde"
            }
          ],
          "type": "basic"
        }
      ]
    }
  ]
}
```

[genesy-link]: https://genesy.github.io/karabiner-complex-rules-generator/#eyJ0aXRsZSI6IlRhbGVzIG9mIE1haidFeWFsIiwicnVsZXMiOlt7ImRlc2NyaXB0aW9uIjoiQ2hhbmdlIEVzY2FwZSB0byBgIHRvIGF2b2lkIHdpbmRvd2VkIGZ1bGxzY3JlZW4gaXNzdWVzIiwibWFuaXB1bGF0b3JzIjpbeyJjb25kaXRpb25zIjpbeyJidW5kbGVfaWRlbnRpZmllcnMiOlsib3JnXFwudGU0XFwuVC1FbmdpbmUiXSwidHlwZSI6ImZyb250bW9zdF9hcHBsaWNhdGlvbl9pZiJ9XSwiZnJvbSI6eyJrZXlfY29kZSI6ImVzY2FwZSJ9LCJ0byI6W3sia2V5X2NvZGUiOiJncmF2ZV9hY2NlbnRfYW5kX3RpbGRlIn1dLCJ0eXBlIjoiYmFzaWMifV19XX0=

Hopefully if anyone else wants to play on Mac and hits either of these issues this post will help them move past it easily
