export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      const mainResponse = await fetch('https://www.bonbast.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        }
      });
      
      const html = await mainResponse.text();
      const cookies = mainResponse.headers.get('set-cookie') || '';
      
      const paramMatch = html.match(/param:\s*"([^"]+)"/);
      if (!paramMatch) {
        return new Response(JSON.stringify({ 
          error: 'param not found',
          htmlPreview: html.substring(0, 1000),
          cookies: cookies
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const param = paramMatch[1];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const apiResponse = await fetch('https://www.bonbast.com/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'en-US,en;q=0.5',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://www.bonbast.com',
          'Referer': 'https://www.bonbast.com/',
          'Cookie': cookies
        },
        body: `param=${encodeURIComponent(param)}`
      });
      
      const rawData = await apiResponse.json();
      
      if (rawData.reset) {
        return new Response(JSON.stringify({ 
          error: 'Session expired, retry needed',
          reset: true 
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const result = {
        timestamp: new Date().toISOString(),
        lastModified: rawData.last_modified || null,
        currencies: {},
        gold: {},
        coins: {}
      };
      
      const currencyCodes = ['usd', 'eur', 'gbp', 'chf', 'cad', 'aud', 'sek', 'nok', 'rub', 'thb', 
                             'sgd', 'hkd', 'azn', 'amd', 'dkk', 'aed', 'jpy', 'try', 'cny', 'sar', 
                             'inr', 'myr', 'afn', 'kwd', 'iqd', 'bhd', 'omr', 'qar'];
      
      for (const code of currencyCodes) {
        const sell = rawData[`${code}1`];
        const buy = rawData[`${code}2`];
        if (sell !== undefined && buy !== undefined) {
          result.currencies[code] = { sell, buy };
        }
      }
      
      const goldItems = ['bitcoin', 'ounce', 'mithqal', 'gol18'];
      for (const item of goldItems) {
        if (rawData[item] !== undefined) {
          result.gold[item] = rawData[item];
        }
      }
      
      const coinItems = ['azadi1', 'emami1', 'azadi1_2', 'azadi1_4', 'azadi1g'];
      for (const coin of coinItems) {
        const sell = rawData[coin];
        const buy = rawData[`${coin}2`];
        if (sell !== undefined && buy !== undefined) {
          result.coins[coin] = { sell, buy };
        }
      }

      if (path === '/currencies') {
        return new Response(JSON.stringify({
          timestamp: result.timestamp,
          lastModified: result.lastModified,
          data: result.currencies
        }, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        });
      }

      if (path === '/gold') {
        return new Response(JSON.stringify({
          timestamp: result.timestamp,
          lastModified: result.lastModified,
          data: result.gold
        }, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        });
      }

      if (path === '/coins') {
        return new Response(JSON.stringify({
          timestamp: result.timestamp,
          lastModified: result.lastModified,
          data: result.coins
        }, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        });
      }
      
      return new Response(JSON.stringify(result, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message, 
        stack: error.stack 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
