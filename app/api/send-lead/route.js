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

    const response = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `rfnqf98pj98b7wqz2xp8zr1qctjh7kaxkvfkp5g3sq3ahagu5lmjs9864cvsh7cq`
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
