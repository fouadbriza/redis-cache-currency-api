const axios = require("axios");
const client = require("../redisClient");


const rateController = async (req,res) => {
const {from,to} = req.body;

if (!from || !to) return res.status(400).json({ error: "Missing 'from' or 'to' currency" });
const key = `rate:${from}:${to}`

try {
const cachedRate = await client.get(key);

 if (cachedRate) {
      return res.json({
        rate: cachedRate,
        source: "cache",
        timestamp: new Date().toISOString(),
      });
    }

const response = await axios.get(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
const fetchedRate = response.data.rates[to];
await client.setEx(key, 300, fetchedRate.toString());

return res.json({
        rate: parseFloat(cachedRate),
        source: "cache",
        timestamp: new Date().toISOString(),
      });
    

} catch(err) {
    console.error("failed to fetch",err)
    return res.status(500).error({error: "failed to fetch exchange rate"});
}


}

module.exports = rateController;
