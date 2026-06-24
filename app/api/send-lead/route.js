export async function POST(request) {
  try {
    const data = await request.json();

    const payload = {
      email: data.correo,
      firstName: data.nombre.split(' ')[0] || 'Lead',
      lastName: data.nombre.split(' ').slice(1).join(' ') || '',
      phone: '',
      custom_fields: {
        instagram: data.instagram,
        país: data.país,
        edad: data.edad,
        diagnóstico: data.diagnóstico,
        score_reversión: String(data.score),
        categoría: data.categoría,
        emoción_actual: data.emoción,
        presupuesto: data.presupuesto,
        timestamp: new Date().toISOString()
      },
      tags: data.etiqueta || ""
    };

    const response = await fetch('https://systeme.io/api/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer xu6nsy7sfz9qzzrxjbrc00xe306rgb3p0x63b6geqtokeyfv9s6g9m6a9k6tzw0s`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('Systeme.io response:', response.status, responseText);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error en route:', error);
    return Response.json({ success: true });
  }
}
