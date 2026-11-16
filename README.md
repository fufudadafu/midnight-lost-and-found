# 午夜失物局

末班車開走後，玩家接手車站午夜失物櫃。從三條證物查出一把傘、一張車票與一只八音盒背後的故事。每案約二至三分鐘，有提示、即時回饋與結案詳解。

## 遊玩

雙擊 `index.html` 即可在瀏覽器開啟。網站無須安裝或登入。選擇一案，展開證物，選出推論並提交。答對後，破案紀錄會儲存在同一個瀏覽器。以本機檔案開啟時，跨次儲存依瀏覽器而定。

## 新增內容

先讀 [AGENTS.md](./AGENTS.md)，再在 [cases.js](./cases.js) 新增一筆案件。共用介面會自動生成卡片與案件頁面。可把這句指令交給 AI。

> 讀取 AGENTS.md，在 cases.js 新增一案「停在零點的懷錶」。設計三條證物、三個選項、唯一正解、提示與結案說明。完成後測試錯答、答對與計數。

## GitHub Pages

將專案檔案放在 GitHub 儲存庫根目錄。在該儲存庫的 **Settings → Pages** 選擇 **Deploy from a branch**，指定 **main** 和 **/(root)**，然後按 **Save**。部署完成後，從 Pages 設定頁開啟網站。

[GitHub Pages 官方發布步驟](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
