# اسکرپر API بون‌بست (Bonbast API Scraper)

یک **Cloudflare Worker** که نرخ‌های لحظه‌ای ارز، طلا و سکه را از سایت **Bonbast.com** دریافت کرده و به‌صورت یک **API تمیز با خروجی JSON** ارائه می‌دهد.



## راه‌اندازی (Setup)

1. وارد [داشبورد Cloudflare](https://dash.cloudflare.com/) شوید
2. به بخش **Workers & Pages** بروید
3. روی **Create Application** → **Create Worker** کلیک کنید
4. کد موجود در فایل `worker.js` را کپی کرده و در ویرایشگر پیست کنید
5. روی **Save and Deploy** کلیک کنید
6. API شما در آدرس زیر فعال می‌شود:

```
https://your-worker.workers.dev
```



## مسیرهای API (API Endpoints)

### GET /

تمام داده‌ها (ارزها، طلا و سکه‌ها) را برمی‌گرداند.

**نمونه پاسخ:**

```json
{
  "timestamp": "2025-12-23T09:00:00.000Z",
  "lastModified": "Tuesday 1404/10/2 12:08:29",
  "currencies": {
    "usd": { "sell": 727000, "buy": 717000 },
    "eur": { "sell": 752000, "buy": 742000 }
  },
  "gold": {
    "bitcoin": 95000,
    "ounce": 2650,
    "mithqal": 150000000,
    "gol18": 32000000
  },
  "coins": {
    "azadi1": { "sell": 650000000, "buy": 640000000 },
    "emami1": { "sell": 730000000, "buy": 720000000 }
  }
}
```



### GET /currencies

فقط نرخ تبدیل ارزها را برمی‌گرداند.

**نمونه پاسخ:**

```json
{
  "timestamp": "2025-12-23T09:00:00.000Z",
  "lastModified": "Tuesday 1404/10/2 12:08:29",
  "data": {
    "usd": { "sell": 727000, "buy": 717000 },
    "eur": { "sell": 752000, "buy": 742000 }
  }
}
```



### GET /gold

قیمت طلا و بیت‌کوین را برمی‌گرداند.

**نمونه پاسخ:**

```json
{
  "timestamp": "2025-12-23T09:00:00.000Z",
  "lastModified": "Tuesday 1404/10/2 12:08:29",
  "data": {
    "bitcoin": 95000,
    "ounce": 2650,
    "mithqal": 150000000,
    "gol18": 32000000
  }
}
```



### GET /coins

قیمت سکه‌های طلای ایران را برمی‌گرداند.

**نمونه پاسخ:**

```json
{
  "timestamp": "2025-12-23T09:00:00.000Z",
  "lastModified": "Tuesday 1404/10/2 12:08:29",
  "data": {
    "azadi1": { "sell": 650000000, "buy": 640000000 },
    "emami1": { "sell": 730000000, "buy": 720000000 },
    "azadi1_2": { "sell": 340000000, "buy": 335000000 },
    "azadi1_4": { "sell": 180000000, "buy": 175000000 },
    "azadi1g": { "sell": 75000000, "buy": 73000000 }
  }
}
```



## مثال‌های استفاده (Usage Examples)

### JavaScript / Node.js

```javascript
const response = await fetch('https://your-worker.workers.dev/currencies');
const data = await response.json();
console.log(data.data.usd);
```

### cURL

```bash
curl https://your-worker.workers.dev/gold
```

### Python

```python
import requests
response = requests.get('https://your-worker.workers.dev/coins')
print(response.json())
```




## نکات مهم (Notes)

* تمام قیمت‌ها به **تومان ایران** هستند 
* داده‌ها در سایت بون‌بست هر **۳۰ ثانیه** به‌روزرسانی می‌شوند
* برای رعایت محدودیت‌ها، در Worker یک **تاخیر ۱ ثانیه‌ای** اعمال شده است



## کدهای ارز (Currency Codes)

`usd`, `eur`, `gbp`, `chf`, `cad`, `aud`, `sek`, `nok`, `rub`, `thb`,
`sgd`, `hkd`, `azn`, `amd`, `dkk`, `aed`, `jpy`, `try`, `cny`, `sar`,
`inr`, `myr`, `afn`, `kwd`, `iqd`, `bhd`, `omr`, `qar`



## آیتم‌های طلا (Gold Items)

* `bitcoin` : قیمت بیت‌کوین به دلار
* `ounce` : قیمت هر اونس طلا به دلار
* `mithqal` : قیمت مثقال طلا به تومان
* `gol18` : قیمت هر گرم طلای ۱۸ عیار به تومان



## آیتم‌های سکه (Coin Items)

* `azadi1` : سکه تمام بهار آزادی
* `emami1` : سکه امامی
* `azadi1_2` : نیم سکه
* `azadi1_4` : ربع سکه
* `azadi1g` : سکه گرمی

