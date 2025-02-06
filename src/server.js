const axios = require('axios'); // biblioteca para acessar a internet
const cheerio = require('cheerio'); // biblioteca para manipular HTML

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { fundo } = req.body;
        try {
            const fundoAtualizado = await main(fundo);
            return res.status(200).json({ fundoAtualizado });
        } catch (error) {
            console.error('Erro:', error);
            return res.status(500).json({ error: 'Erro ao coletar dados' });
        }
    }

    if (req.method === 'GET') {
        try {
            console.error("Métod GET não disponível.");
        } catch (error) {
            console.error('Erro:', error);
            return res.status(500).json({ error: 'Erro ao coletar dados' });
        }
    }

    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
};

async function main(fundo) {
    await Promise.all([
        fetchFundData(fundo)
    ]);
    return dados;
}
async function fetchFundData(fundo) {
    const url = `https://investidor10.com.br/fiis/${fundo.ticker}`;
    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        
        fundo.cotacao = $("._card.cotacao ._card-body div .value").text().trim();
        fundo.pvp = $("._card.vp ._card-body span").text().trim();
        fundo.precoJusto = $(".cell").eq(12).find(".desc .value").text().trim();
        fundo.valueDividendYeldTwelveMonths = $('.content--info .content--info--item').eq(3).children('.content--info--item--value').eq(0).text().trim();
        fundo.lastDividend = $(".cell").eq(14).find(".desc .value").text().trim();
        fundo.liquidez = $("._card.val ._card-body span").text().trim();
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
    }
}