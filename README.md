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
### Requirements
- node >= v14 (因為有用到 optional chaining，Node版本須至少14)

### Steps -
#### 1. Install dependencies 
```
npm install
```
#### 2. 啟動專案
```
npm start
```
or
```
npm run dev
```

---

## 📚 專案架構

---

## 👪 第三方 library

---

## 📝 註解的原則

在此專案中，有三種情況會寫到註解

- [code 的背景需求/含意](https://twitter.com/BenLesh/status/1372562839475470336?s=20)
- 因為`Javascript本身沒有限制型別`，所以會在每個funcion上方加上註解，來說明 `input、output 的型別跟欄位說明`
- 因為`這專案為徵才小專案`，有些地方是為了`程式的擴充性`所寫的，此時也會加上註解
  - 像是 HahowApi.apiLogs 是為了之後可以透過 ELK 留下呼叫外部API的紀錄

---

## 🤯 遇到的困難

---

## 🗿 其他