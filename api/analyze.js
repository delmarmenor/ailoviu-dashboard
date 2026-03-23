export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten peticiones POST' });
  }

  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'No se han proporcionado datos' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'La clave de la API de Anthropic no está configurada' });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Eres un analista experto de audiencias de televisión regional española.
          Analiza los siguientes datos de audiencia del programa AILOVIU en La 7 TV Murcia.
          
          DATOS:
          ${JSON.stringify(data)}
          
          Analiza un máximo de 200 palabras en español:
          1. Tendencia del share y comparación con la media de la cadena.
          2. Comparativa directa con su competidor Murcia Conecta.
          3. Un dato positivo destacado.
          4. Una recomendación estratégica fundamentada.
          
          Responde de forma directa, con cifras concretas. Sé profesional pero ágil. No uses markdown.`
        }]
      })
    });

    const result = await response.json();
    
    if (result.error) {
      return res.status(response.status).json({ error: result.error.message });
    }

    const text = result.content?.[0]?.text || 'Sin respuesta del analista';
    
    // CORS Header for flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ text });

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'Error procesando el análisis de IA: ' + error.message });
  }
}
