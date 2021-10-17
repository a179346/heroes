<h1 align="center">Heroes 🦸</h1>
<p>
  <a href="https://github.com/a179346/heroes/actions/workflows/test.yml" target="_blank">
    <img alt="Documentation" src="https://github.com/a179346/heroes/actions/workflows/test.yml/badge.svg" />
  </a>
  <a href="https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/a179346/heroes-apidoc/main/api.json" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

> Heroes API server

## 🔗 Link
+ [API文件](https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/a179346/heroes-apidoc/main/api.json)

---

## 📩 API server
`https://heroes-hahow.herokuapp.com`

---

## 💻 該如何跑起這個 server

### 方法一、 node 啟動
> ### Requirements
> - node >= v14 (因為有用到 optional chaining，Node版本須 > 14)
> 
> ### Steps -
> #### 1. Install dependencies 
> ```
> npm install
> ```
> #### 2. 啟動專案
> ```
> npm start
> ```
> or
> ```
> npm run dev
> ```

### 方法二、 docker 啟動
> ### Requirements
> - docker
> 
> ### Steps -
> #### 1. Build Docker Image
> ```
> docker build -t heroes-api .
> ```
> #### 2. 啟動專案
> ```
> docker run -p 3100:3100 heroes-api
> ```

---

## 📚 專案架構

> `client` -> `api server(此專案)` -> `https://hahow-recruit.herokuapp.com`

### 檔案結構
- 📁 .github - 讓github action自動跑測試 (當push上main時)
- 📁 externalApi - 串接外部API層
  - 📄 hahowApi.js - 在這邊串接`https://hahow-recruit.herokuapp.com`
- 📁 lib - 存放其他專案可共用的資料結構或function
  - 📄 ApiError.js - 錯誤結構 (根據這個回傳錯誤給client)
  - 📄 ApiResponse.js - 成功回傳結構 (根據這個的內容回傳給client)
- 📁 middlewares - express的middlewares
  - 📄 authUser.js - 驗證使用者身分middleware
  - 📄 getHahowApi.js - 把 HahowApi 放到 req 的 middleware
- 📁 routes - api server的各個router
- 📁 test - 測試程式
  - 📁 api.test - 測試各個routes，呼叫回傳的結果
  - 📁 unit.test - 針對單一function測試 (這專案主要測試`hahowApi.js`)
- 📄 app.js - express server的routes指向、統一回傳client的地方
- 📄 config.js - 專案的config (在這專案中，只有環境變數)
- 📄 index.js - 程式的進入點 (在這邊讓server開始listen)

---

## 👪 第三方 library

### dependencies
- [axios](https://www.npmjs.com/package/axios) - 很常見的`HTTP client`，用來`發出HTTP Request`。在瀏覽器跟node中，都很廣泛使用。
- [dotenv](https://www.npmjs.com/package/dotenv) - 自動將`.env`檔案的環境變數，丟到`process.env`裡。在開源專案中一般不會將`.env`檔上傳到git，但可以放一個`.env.example`檔，讓維護的人一眼就看到這專案有哪些環境變數。
- [express](https://www.npmjs.com/package/express) - Node.js中非常常見的`web框架`。輕量化的同時有很有彈性。

### devDependencies
- [chai](https://www.npmjs.com/package/chai) - 在`測試程式`中，很常被使用的`斷言庫(assertion library)`。類似node內建的`assert`。
- [eslint](https://www.npmjs.com/package/eslint) - `檢查JavaScript程式碼是否符合規則`，可以讓團隊中寫的code遵循一定的格式，是提高Javascript程式品質很好用的工具。
- [mocha](https://www.npmjs.com/package/mocha) - JavaScript 的`測試框架`
- [nock](https://www.npmjs.com/package/nock) - Node.js的HTTP模擬和預期庫，可以`攔截對外的HTTP Request，並模擬回應`。在測試時如果依賴外部的API，是比較不穩定的，因為他們可能會改變或停止服務，因此需要mock http的回應來寫測試。
- [nodemon](https://www.npmjs.com/package/nodemon) - 可用來`自動重啟node程式`，開發階段非常好用。
- [supertest](https://www.npmjs.com/package/supertest) - 使用supertest在跑測試時，不用先啟動server即可進行測試。


---

## 📝 註解的原則

在此專案中，有三種情況會寫到註解

- [code 的背景需求/含意](https://twitter.com/BenLesh/status/1372562839475470336?s=20)
- 因為`Javascript本身沒有限制型別`，所以會在每個funcion上方加上註解，來說明 `input、output 的型別跟欄位說明`
- 因為`這專案為徵才小專案`，有些地方是為了`程式的擴充性`所寫的，此時也會加上註解
  - 像是 HahowApi.apiLogs 是為了之後可以透過 ELK 留下呼叫外部API的紀錄

---

## 🤯 遇到的困難
因為這個專案的內容最主要是串接API，在做的過程中，`最猶豫的點是要不要加一些功能吧`，主要是`擔心會讓這個專案失焦`。

像是 
- 要不要實作完美關機
- 太久沒回覆給client，要不要加timeout

最後都決定沒有加上去，`讓專案重點著重在怎麼串接API`。

---

## 🗿 對這專案的一些看法
因為這支程式本身沒有狀態，只要多開幾台機器，前方架個Load Balancer就可以有不錯的scalability。

如果要避免太頻繁的呼叫 `https://hahow-recruit.herokuapp.com` 的API，而且回傳的資料即時性不是第一順位的話，可以加裝redis來cache回傳的結果，以降低打到 `https://hahow-recruit.herokuapp.com` 的壓力。