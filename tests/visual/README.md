# Visual regression fixtures

Tiny Vite app that mounts key morya-ui components for screenshot diffs.

## Commands

```bash
pnpm exec playwright install chromium   # once
pnpm test:visual:update                 # write baselines for this OS
pnpm test:visual                        # compare
```

Baselines live under `baselines/<platform>/` (`win32`, `linux`, `darwin`) because Chromium text rendering differs across OS. CI asserts **linux** baselines.

Until `baselines/linux/` is committed, CI bootstraps Linux PNGs and uploads the `visual-baselines-linux` artifact (warning only). Download those files, commit them under `tests/visual/baselines/linux/`, and CI will hard-compare afterwards.

## Cases

| File           | Coverage                                                 |
| -------------- | -------------------------------------------------------- |
| `button.png`   | Button types / danger / text / loading / disabled |
| `form.png`     | Input, Checkbox, Switch, Tag                             |
| `feedback.png` | Alert + Card                                             |
| `full.png`     | Entire fixture page                                      |
