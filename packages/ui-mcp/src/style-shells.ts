/**
 * Token-only signature shells for Account / Express / Flow / Ops.
 * Pasteable CSS — no hex; brand differences belong in theme overrides.
 */

export interface StyleShell {
  id: string
  surface: string
  titleZh: string
  titleEn: string
  signatureZh: string
  signatureEn: string
  whenZh: string
  whenEn: string
  css: string
  htmlHintZh: string
  htmlHintEn: string
}

export const styleShells: StyleShell[] = [
  {
    id: 'ops-quiet',
    surface: 'ops',
    titleZh: '后台安静面',
    titleEn: 'Quiet ops surface',
    signatureZh: '单一主色强调 + 对齐节奏，无装饰渐变',
    signatureEn: 'One accent + alignment rhythm; no decorative gradients',
    whenZh: '列表 / 表单 / 仪表盘 / 设置等 Operate 表面',
    whenEn: 'List / form / dashboard / settings Operate surfaces',
    htmlHintZh: '结构用 MLayout + MPage*；本壳几乎不需要自定义 CSS',
    htmlHintEn: 'Compose with MLayout + MPage*; little custom CSS needed',
    css: `/* Ops: prefer component spacing; optional page tweaks only */
.ops-page :is(.m-page-content) {
  /* density via MPageContent density prop — do not invent a second scale */
}
.ops-page :is(td, th).is-numeric,
.ops-page .cell-numeric {
  font-variant-numeric: tabular-nums;
  text-align: end;
}`,
  },
  {
    id: 'account-split',
    surface: 'account',
    titleZh: '登录分栏品牌壳',
    titleEn: 'Auth split brand shell',
    signatureZh: '一侧品牌面（主色混底）+ 一侧表单，仅一个签名：品牌字号跳跃',
    signatureEn: 'Brand panel (primary mix) + form; one signature: type jump on brand title',
    whenZh: '登录 / 注册 / 找回密码',
    whenEn: 'Login / register / password recovery',
    htmlHintZh: '对齐 auth-split-shell 片段；文案用产品名，不要「示例」',
    htmlHintEn: 'Align with auth-split-shell snippet; use product copy, not placeholders',
    css: `.login-shell {
  display: grid;
  grid-template-columns: minmax(16rem, 0.95fr) minmax(20rem, 1.05fr);
  min-height: 100vh;
  background: var(--m-color-surface);
}
.login-brand {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--m-space-4);
  padding: clamp(2rem, 6vw, 4.5rem);
  background: color-mix(in srgb, var(--m-color-primary) 12%, var(--m-color-surface));
  border-right: 1px solid var(--m-color-border);
}
.login-brand__mark {
  margin: 0;
  font-size: var(--m-font-size-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--m-color-text-muted);
}
.login-brand__title {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  line-height: 1.2;
  color: var(--m-color-text);
  font-weight: 600;
}
.login-brand__lead {
  margin: 0;
  max-width: 28rem;
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-md);
}
.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--m-space-6);
}
.login-panel {
  width: min(100%, 22rem);
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}
.login-panel__header h2 {
  margin: 0 0 var(--m-space-2);
  font-size: var(--m-font-size-xl);
}
.login-panel__header p,
.login-alert {
  margin: 0;
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-sm);
}
.login-alert {
  color: var(--m-color-danger);
}
@media (max-width: 720px) {
  .login-shell { grid-template-columns: 1fr; }
  .login-brand { border-right: none; border-bottom: 1px solid var(--m-color-border); }
}`,
  },
  {
    id: 'account-centered',
    surface: 'account',
    titleZh: '登录居中信任壳',
    titleEn: 'Centered trust auth shell',
    signatureZh: '居中窄卡 + 顶部门户名，签名是安静边框而非装饰渐变',
    signatureEn: 'Centered narrow card + product mark; signature is quiet border, not gradients',
    whenZh: '无强品牌图、或窄屏优先的认证页',
    whenEn: 'Auth without a strong brand image, or mobile-first',
    htmlHintZh: '单列居中；表单错误用 errorMessage 或 role=alert',
    htmlHintEn: 'Single centered column; form errors via errorMessage or role=alert',
    css: `.auth-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--m-space-6);
  background: var(--m-color-surface);
}
.auth-center__card {
  width: min(100%, 22rem);
  padding: var(--m-space-6);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  background: var(--m-color-surface);
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}
.auth-center__mark {
  margin: 0;
  font-size: var(--m-font-size-sm);
  color: var(--m-color-text-muted);
  letter-spacing: 0.06em;
}
.auth-center__title {
  margin: 0;
  font-size: var(--m-font-size-xl);
  color: var(--m-color-text);
}`,
  },
  {
    id: 'flow-empty-frame',
    surface: 'flow',
    titleZh: '空态轻框',
    titleEn: 'Empty-state light frame',
    signatureZh: '虚线框包住 MEmpty，签名是边框节奏而非插画堆叠',
    signatureEn: 'Dashed frame around MEmpty; signature is border rhythm, not illustration clutter',
    whenZh: '首次使用 / 筛选无结果 / 资源清空',
    whenEn: 'First use / no filter matches / cleared resources',
    htmlHintZh: '优先用 empty-block 片段；框可选',
    htmlHintEn: 'Prefer empty-block snippet; frame is optional',
    css: `.empty-state-shell {
  border: 1px dashed var(--m-color-border);
  border-radius: var(--m-radius-md);
  background: var(--m-color-surface);
  padding: var(--m-space-6);
  display: flex;
  justify-content: center;
}`,
  },
  {
    id: 'flow-result-hero',
    surface: 'flow',
    titleZh: '结果页大标题壳',
    titleEn: 'Result page hero type',
    signatureZh: 'MResult 居中；签名是标题层级与明确下一步',
    signatureEn: 'Centered MResult; signature is type hierarchy + clear next step',
    whenZh: '提交成功 / 失败 / 403 / 404 / 500',
    whenEn: 'Submit success/failure / 403 / 404 / 500',
    htmlHintZh: '用 result-block；不要用 MEmpty 冒充结果页',
    htmlHintEn: 'Use result-block; do not fake results with MEmpty',
    css: `.result-shell {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--m-space-6);
  background: var(--m-color-surface);
}`,
  },
  {
    id: 'express-hero',
    surface: 'express',
    titleZh: '营销首屏平面',
    titleEn: 'Marketing hero plane',
    signatureZh: '首屏单一任务：品牌/标题/一句支持/一组 CTA + 一块实色视觉面',
    signatureEn: 'First viewport one job: brand/title/support/CTA + one solid visual plane',
    whenZh: '落地页 / 定价前导 / 产品介绍',
    whenEn: 'Landing / pricing lead-in / product intro',
    htmlHintZh: '控件仍用 MButton/MTag；禁止未要求的 aurora / 毛玻璃',
    htmlHintEn: 'Controls stay MButton/MTag; no unsolicited aurora/glass',
    css: `.landing-hero {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
  padding: clamp(2rem, 5vw, 4rem) var(--m-space-6);
  background: var(--m-color-surface);
  border-bottom: 1px solid var(--m-color-border);
}
.landing-hero__brand {
  margin: 0;
  font-size: var(--m-font-size-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--m-color-primary);
}
.landing-hero__title {
  margin: 0;
  max-width: 18ch;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  color: var(--m-color-text);
}
.landing-hero__lead {
  margin: 0;
  max-width: 36rem;
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-md);
}
.landing-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-3);
}
.landing-hero__visual {
  margin-top: var(--m-space-5);
  min-height: 12rem;
  padding: var(--m-space-5);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  background: color-mix(in srgb, var(--m-color-primary) 8%, var(--m-color-surface));
}`,
  },
]

export function findStyleShell(idOrSurface: string): StyleShell | undefined {
  const q = idOrSurface.trim().toLowerCase()
  return (
    styleShells.find((s) => s.id === q) ||
    styleShells.find((s) => s.surface === q) ||
    styleShells.find((s) => s.id.includes(q) || s.titleZh.includes(idOrSurface) || s.titleEn.toLowerCase().includes(q))
  )
}

export function listStyleShells(surface?: string): StyleShell[] {
  if (!surface) return styleShells
  const s = surface.trim().toLowerCase()
  return styleShells.filter(
    (item) => item.surface === s || item.id.startsWith(s) || item.whenZh.includes(surface) || item.whenEn.toLowerCase().includes(s),
  )
}
