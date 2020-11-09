import axios from "axios";

const apiKey = "9104ffb069fadd2f23062e35be0ecbee21e1c6905c50e3e3ebc332982f4a2678";

export const cryptoHttp = axios.create({
  baseURL: "https://min-api.cryptocompare.com/data",
  headers: {
    authorization: `Apikey ${apiKey}`,
  },
});

export const fetchCoin = async (coin) => {
  try {
    const { data } = await cryptoHttp.get(`price?fsym=${coin}&tsyms=BRL`);
    return data;
  } catch (e) {
    console.log(e);
  }
};
