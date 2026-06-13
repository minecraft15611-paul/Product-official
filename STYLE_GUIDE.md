# 築本數位工作室 — 視覺風格指南

本文件定義官網的設計語言，供團隊成員與 AI 工具製作頁面時統一參考。

---

## 1. 品牌定調

**風格方向**：科技感 × 高級感。深色背景、藍色光暈、克制的留白，傳遞專業與精緻。
**禁止方向**：網咖風霓虹、過度動畫、跑馬燈、全螢幕自動播放影片。

---

## 2. 色彩系統

所有顏色以 CSS 變數定義，禁止直接寫 hardcode 色值。

```css
:root {
    --bg-dark:           #0a0a0a;   /* 主背景（石墨黑）*/
    --card-bg:           #0e0e0e;   /* 卡片背景 */
    --text-main:         #ffffff;   /* 主要文字 */
    --text-muted:        #8aadd4;   /* 次要文字（藍調灰）*/
    --accent-blue:       #1a4fff;   /* 主強調色（科技藍）*/
    --accent-blue-dim:   #0f2e99;   /* 暗藍（漸層底色）*/
    --border-color:      #0d1a3a;   /* 邊框（藍黑）*/
    --glow-blue:         rgba(26, 79, 255, 0.35);   /* 藍光光暈 */
    --glow-blue-soft:    rgba(26, 79, 255, 0.15);   /* 柔和藍光 */
}
```

**60/30/10 分配原則**
- 60%：`--bg-dark` 背景
- 30%：`--accent-blue` / `--border-color` 功能區塊、分隔線
- 10%：`--accent-blue` 亮點，僅用於 CTA 按鈕、hover 光暈、強調元素

---

## 3. 字體

```css
font-family: 'Inter', -apple-system, sans-serif;
```

- 引入方式：Google Fonts `Inter`
- 標題：大尺寸、letter-spacing 拉開（2px–4px）、font-weight 300–400
- 標籤文字（section label）：`0.75rem`、`letter-spacing: 4px`、`color: var(--text-muted)`
- 內文：`0.85rem–1rem`、`line-height: 1.6`

---

## 4. 按鈕

**CTA 主按鈕（對外頁面）**
```css
background: transparent;
border: 1px solid var(--accent-blue);
color: var(--text-main);
padding: 1rem 2rem;
letter-spacing: 2px;
box-shadow: 0 0 18px var(--glow-blue-soft), inset 0 0 18px rgba(26, 79, 255, 0.05);
transition: 0.3s;

/* hover */
background: var(--accent-blue);
box-shadow: 0 0 32px var(--glow-blue), inset 0 0 24px rgba(26, 79, 255, 0.2);
```

**後台按鈕**
```css
background: #152535;
border: 1px solid #204060;
color: #00d4ff;
transition: all 0.3s ease;

/* hover */
background: #204060;
box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
```

---

## 5. 卡片

```css
background: var(--card-bg);
border: 1px solid var(--border-color);
padding: 2.5rem;
transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;

/* hover */
border-color: rgba(26, 79, 255, 0.5);
box-shadow: 0 0 28px var(--glow-blue-soft), 0 8px 32px rgba(0, 0, 0, 0.4);
transform: translateY(-5px);

/* 底部藍線動畫 */
::after { width: 0; height: 1px; background: var(--accent-blue); transition: width 0.4s; }
:hover::after { width: 100%; }
```

---

## 6. 版面

- 最大寬度：`1200px`，`margin: 0 auto`
- 頁面左右 padding：`2rem`
- Section 上下間距：`6rem 0`
- 網格：`repeat(3, 1fr)`，gap `1.5rem–2rem`

---

## 7. Micro-interactions 規範

- 所有 transition 時間：`0.3s ease`（卡片底線用 `0.4s`）
- hover 效果：藍色光暈（`box-shadow`）+ 位移（`translateY(-5px)`）
- 圖片 hover：`filter: brightness` 提升 + 輕微 `scale(1.02–1.03)`
- Modal：`opacity` + `visibility` 淡入淡出，`backdrop-filter: blur(5px)`
- **禁止**：全螢幕動畫、跑馬燈、自動播放

```css
/* 無障礙：使用者偏好減少動畫時關閉所有過渡 */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; }
}
```

---

## 8. 頁面結構與色彩對應

| 頁面 | 主色調 | 強調色 |
| :--- | :--- | :--- |
| 對外頁面（首頁、作品集、關於、聯絡） | `#0a0a0a` + `#1a4fff` | `#1a4fff` |
| 登入頁 | `#0a0a0a` + `#1a4fff` | `#1a4fff` |
| 後台管理頁 | `#000` radial-gradient + `#0b1525` | `#00d4ff` |

> 後台與前台強調色刻意區分，後台用青藍 `#00d4ff` 與前台深藍 `#1a4fff` 做視覺區隔，讓管理員明確感知「現在在後台」。

---

## 9. 禁止事項

- 禁止使用純黑 `#000000` 作為主背景（用 `#0a0a0a`）
- 禁止直接 hardcode 色值，一律使用 CSS 變數
- 禁止超過 3 種以上的藍色變體出現在同一頁面
- 禁止跑馬燈、全螢幕自動播放影片、複雜粒子動畫
- 禁止資訊密度過高，頁面需保持大量留白