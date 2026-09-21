<script setup lang="ts">
/**
 * 黄金样例：营销落地页（Express）
 * @see DESIGN.md · page-layouts.md · surfaces § Express
 * 首屏单一任务；控件用 M*；色彩只走 --m-*；避开 AI 默认脸。
 */
import { MAccordion, MButton, MConfigProvider, MTag, zhCN } from 'morya-ui'

const faqTabs = [
  { value: 'stack', header: '必须用特定框架吗？' },
  { value: 'hosting', header: '流水线跑在哪里？' },
  { value: 'migrate', header: '如何从现有 CI 迁过来？' },
]
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <div class="landing">
      <header class="landing-nav">
        <span class="landing-nav__brand">流水线 CI</span>
        <nav class="landing-nav__links" aria-label="页面导航">
          <a href="#why">为何选择</a>
          <a href="#capabilities">能力</a>
          <a href="#faq">常见问题</a>
        </nav>
        <MButton label="免费试用" size="small" />
      </header>

      <section class="landing-hero" aria-labelledby="hero-title">
        <p class="landing-hero__brand">流水线 CI</p>
        <h1 id="hero-title">把每次提交变成可回放的交付</h1>
        <p class="landing-hero__lead">
          为工程团队准备的构建与发布编排。少点配置，多看结果。
        </p>
        <div class="landing-hero__cta">
          <MButton label="开始使用" />
          <MButton label="查看文档" severity="secondary" text />
        </div>
        <div class="landing-hero__visual" role="img" aria-label="构建时间线示意">
          <div class="landing-hero__track">
            <span>检出</span>
            <span>测试</span>
            <span>制品</span>
            <span>发布</span>
          </div>
        </div>
      </section>

      <section id="why" class="landing-section">
        <h2>为何选择</h2>
        <p class="landing-section__lead">面向真实仓库节奏，而不是演示用的仪表盘皮肤。</p>
        <ul class="landing-points">
          <li>
            <strong>可回放</strong>
            <span>每次运行保留完整日志与产物索引，失败可复现。</span>
          </li>
          <li>
            <strong>少样板</strong>
            <span>默认流水线覆盖检出、缓存与并行矩阵，按需覆盖。</span>
          </li>
          <li>
            <strong>权限清楚</strong>
            <span>环境、密钥与审批流按仓库边界隔离。</span>
          </li>
        </ul>
      </section>

      <section id="capabilities" class="landing-section landing-section--alt">
        <h2>能力</h2>
        <p class="landing-section__lead">用组件库控件表达交互，不引入第二套 UI。</p>
        <div class="landing-cards">
          <article>
            <MTag value="构建" severity="info" />
            <h3>并行矩阵</h3>
            <p>按系统与 Node 版本展开任务，失败任务可单独重跑。</p>
          </article>
          <article>
            <MTag value="发布" severity="success" />
            <h3>环境门禁</h3>
            <p>生产发布需要审批与变更说明，记录谁在何时放行。</p>
          </article>
          <article>
            <MTag value="观测" />
            <h3>耗时对比</h3>
            <p>同分支历史耗时并排，找出突然变慢的步骤。</p>
          </article>
        </div>
      </section>

      <section id="faq" class="landing-section">
        <h2>常见问题</h2>
        <MAccordion :tabs="faqTabs" default-value="stack">
          <template #stack>
            <p class="landing-faq">
              任意可容器化的仓库即可。示例以 Vue / Node 为主，不绑定单一前端脚手架。
            </p>
          </template>
          <template #hosting>
            <p class="landing-faq">
              可自托管 runner，也可使用托管队列。密钥不进入日志明文。
            </p>
          </template>
          <template #migrate>
            <p class="landing-faq">
              从现有 YAML 映射阶段与缓存键；保留原有制品路径可降低切换成本。
            </p>
          </template>
        </MAccordion>
      </section>

      <footer class="landing-footer">
        <span>流水线 CI</span>
        <MButton label="联系销售" severity="secondary" text />
      </footer>
    </div>
  </MConfigProvider>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--m-color-surface);
  color: var(--m-color-text);
}

.landing-nav {
  display: flex;
  align-items: center;
  gap: var(--m-space-4);
  padding: var(--m-space-4) clamp(1.25rem, 4vw, 3rem);
  border-bottom: 1px solid var(--m-color-border);
}

.landing-nav__brand {
  font-weight: 700;
  letter-spacing: -0.02em;
}

.landing-nav__links {
  display: flex;
  flex: 1;
  gap: var(--m-space-4);
  margin-left: var(--m-space-2);
}

.landing-nav__links a {
  color: var(--m-color-text-muted);
  text-decoration: none;
  font-size: 0.9375rem;
}

.landing-nav__links a:hover {
  color: var(--m-color-primary);
}

.landing-hero {
  display: grid;
  gap: var(--m-space-4);
  padding: clamp(2.5rem, 8vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) clamp(3rem, 8vw, 5rem);
  max-width: 72rem;
}

.landing-hero__brand {
  margin: 0;
  font-size: 0.8125rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-color-text-muted);
}

.landing-hero h1 {
  margin: 0;
  max-width: 14em;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.landing-hero__lead {
  margin: 0;
  max-width: 36rem;
  font-size: 1.125rem;
  line-height: 1.55;
  color: var(--m-color-text-muted);
}

.landing-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-3);
  margin-top: var(--m-space-2);
}

.landing-hero__visual {
  margin-top: var(--m-space-5);
  padding: var(--m-space-5);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--m-color-primary) 12%, var(--m-color-surface)),
      var(--m-color-surface) 60%
    );
}

.landing-hero__track {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--m-space-3);
}

.landing-hero__track span {
  padding: var(--m-space-3) var(--m-space-4);
  border-left: 3px solid var(--m-color-primary);
  background: color-mix(in srgb, var(--m-color-surface) 80%, transparent);
  font-size: 0.875rem;
  font-weight: 600;
}

.landing-section {
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem);
  max-width: 72rem;
}

.landing-section--alt {
  border-block: 1px solid var(--m-color-border);
  background: color-mix(in srgb, var(--m-color-border) 18%, var(--m-color-surface));
  max-width: none;
}

.landing-section h2 {
  margin: 0 0 var(--m-space-3);
  font-size: 1.75rem;
  letter-spacing: -0.02em;
}

.landing-section__lead {
  margin: 0 0 var(--m-space-5);
  max-width: 36rem;
  color: var(--m-color-text-muted);
}

.landing-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--m-space-4);
}

.landing-points li {
  display: grid;
  gap: var(--m-space-2);
  max-width: 40rem;
}

.landing-points strong {
  font-size: 1.0625rem;
}

.landing-points span {
  color: var(--m-color-text-muted);
  line-height: 1.55;
}

.landing-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--m-space-4);
  max-width: 72rem;
}

.landing-cards article {
  display: grid;
  gap: var(--m-space-3);
  padding: var(--m-space-5);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  background: var(--m-color-surface);
}

.landing-cards h3 {
  margin: 0;
  font-size: 1.125rem;
}

.landing-cards p {
  margin: 0;
  color: var(--m-color-text-muted);
  line-height: 1.55;
}

.landing-faq {
  margin: 0;
  color: var(--m-color-text-muted);
  line-height: 1.55;
}

.landing-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-space-4);
  padding: var(--m-space-5) clamp(1.25rem, 4vw, 3rem);
  border-top: 1px solid var(--m-color-border);
  color: var(--m-color-text-muted);
}

@media (max-width: 900px) {
  .landing-nav__links {
    display: none;
  }

  .landing-hero__track,
  .landing-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .landing-hero__track,
  .landing-cards {
    grid-template-columns: 1fr;
  }
}
</style>
