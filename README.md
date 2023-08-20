# 此為 Life 前端專案

## 架構

使用 vite + react + typescript + react redux + tailwind + mui

### Plugin

| Name                             | Description                 |
| -------------------------------- | --------------------------- |
| eslint                           | js 限制                     |
| sass                             | for css                     |
| prettier                         | Code 排版                   |
| prettier-plugin-tailwindcss      | prettier for tailwind class |
| husky + lint-staged + commitlint | 限制 commit                 |
| xlsx                             | excel 應用                  |
| react-quill                      | 編輯器                      |
| notistack                        | 提醒 alert                  |
| js-cookie                        | cookie 應用                 |
| react-datepicker                 | 日期選擇器元件              |

## 注意

目前可 build 自已的與母親的，要 build 給家人時需改動以下

-   deploy.bat 或 deploy.sh 路徑改成 /mom.git
-   404.html 路徑改成 /mom
-   .env.production VITE_BASE_URL = /mom
-   src/api/stock apiPath = '2'
-   src/config/constant FEE_RATE = 0.001425 \* 0.6
-   src/App.tsx 屏蔽多餘的頁面

## 位置

[Demo](https://howie12207.github.io/life/)

[Code](https://github.com/howie12207/life)
