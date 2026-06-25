'use client';

import React, { useState, useCallback } from 'react';

export default function ReversalQuiz() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '', correo: '', whatsapp: '', instagram: '', país: '',
    edad: null, diagnóstico: null, tiempodiagnóstico: null, hba1c: null, medicamentos: null,
    emoción: null, preocupación: null, objetivo: null, compromiso: null, presupuesto: null
  });
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canAdvance = () => {
    if (step === 0) return formData.nombre && formData.correo && formData.instagram && formData.whatsapp && formData.país && formData.correo.includes('@');
    if (step === 1) return formData.edad;
    if (step === 2) return formData.diagnóstico;
    if (step === 3) return formData.tiempodiagnóstico;
    if (step === 4) return formData.hba1c;
    if (step === 5) return formData.medicamentos;
    if (step === 6) return formData.emoción;
    if (step === 7) return formData.preocupación;
    if (step === 8) return formData.objetivo;
    if (step === 9) return formData.compromiso;
    if (step === 10) return formData.presupuesto;
    return true;
  };

  const calculateScore = useCallback(() => {
    let score = 0;
    if (formData.edad === '<40' || formData.edad === '40-55') score += 2;
    else if (formData.edad === '56-70') score += 1;
    if (formData.diagnóstico === 'Resistencia' || formData.diagnóstico === 'Prediabetes') score += 4;
    else if (formData.diagnóstico === 'Diabetes2') score += 3;
    else if (formData.diagnóstico === 'NoSeguro') score += 1;
    if (formData.tiempodiagnóstico === '<1año' || formData.tiempodiagnóstico === '1-5años') score += 4;
    else if (formData.tiempodiagnóstico === '>5años') score += 3;
    else if (formData.tiempodiagnóstico === 'NoConfirmado') score += 2;
    if (formData.hba1c === '<5.7') score += 4;
    else if (formData.hba1c === '5.7-6.4') score += 3;
    else if (formData.hba1c === '6.5-7.0') score += 2;
    else if (formData.hba1c === 'NoSé') score += 1;
    if (formData.medicamentos === 'Ninguno') score += 4;
    else if (formData.medicamentos === '1oral') score += 3;
    else if (formData.medicamentos === '2+orales') score += 2;
    else if (formData.medicamentos === 'Orales+Insulina' || formData.medicamentos === 'Insulina') score = -1;
    if (formData.compromiso === 'Listo') score += 4;
    else if (formData.compromiso === 'Dudas') score += 2;
    return score;
  }, [formData]);

  const getSegmento = useCallback(() => {
    const score = calculateScore();
    const hba1cRange = formData.hba1c === '<5.7' ? 'menor a 5.7%' : formData.hba1c === '5.7-6.4' ? '5.7-6.4%' : formData.hba1c === '6.5-7.0' ? '6.5-7.0%' : formData.hba1c === '>7.0' ? 'mayor a 7.0%' : 'no disponible';

    if (formData.medicamentos === 'Insulina' || formData.medicamentos === 'Orales+Insulina') {
      return {
        score: 'Insulina', categoría: 'Riesgo Metabólico Elevado', etiqueta: null, mensaje: '🚨 RIESGO METABÓLICO ELEVADO',
        detalle: 'Como estás usando insulina, sabemos que la función de tu páncreas ya se ha deteriorado. En este estado, nuestro enfoque no sería la reversión, sino enfocarnos en mejorar significativamente tu calidad de vida y prevenir complicaciones a largo plazo.\n\nEsto requiere un seguimiento médico especializado y un control nutricional riguroso que optimice tu respuesta metabólica al máximo posible.\n\nPor ello, te recomendamos que busques asesoría con un especialista en diabetes que pueda brindarte el seguimiento personalizado que necesitas. Nuestro programa de reversión no es el mejor fit para tu situación en este momento.\n\nTe deseamos éxitos en el cuidado de tu salud.',
        mostrarBoton: false, ctaUrl: null
      };
    }

    if (score >= 15) {
      if (formData.presupuesto && formData.presupuesto !== 'NoPodría') {
        return {
          score, categoría: 'Alto Pronóstico', etiqueta: 'Prospecto_Formulario_VSL', mensaje: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          detalle: `Basado en tus respuestas, tu metabolismo aún muestra excelente funcionalidad y tu hemoglobina glicosilada está en ${hba1cRange}. Esto significa que tu páncreas aún tiene la capacidad de recuperar su función en un 100%.\n\nAprovecha esta oportunidad que tienes ahora de normalizar tu glucosa y recuperar tu salud por completo. Es sin duda el mejor momento para actuar si quieres vivir libre de enfermedad.`,
          mostrarBoton: true, ctaUrl: 'https://www.somosplantpowered.com/vsl-piad'
        };
      } else {
        return {
          score, categoría: 'Alto Pronóstico', etiqueta: 'Prospecto_Formulario_free', mensaje: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          detalle: `Basado en tus respuestas, tu metabolismo aún muestra excelente funcionalidad y tu hemoglobina glicosilada está en ${hba1cRange}. Esto significa que tu páncreas aún tiene la capacidad de recuperar su función en un 100%.\n\nAprovecha esta oportunidad que tienes ahora de normalizar tu glucosa y recuperar tu salud por completo. Es sin duda el mejor momento para actuar si quieres vivir libre de enfermedad.`,
          mostrarBoton: true, ctaUrl: '#'
        };
      }
    } else if (score >= 10 && score < 15) {
      if (formData.presupuesto && formData.presupuesto !== 'NoPodría') {
        return {
          score, categoría: 'Pronóstico Intermedio', etiqueta: 'Prospecto_Formulario_VSL', mensaje: '⚠️ PRONÓSTICO DE REVERSIÓN INTERMEDIO',
          detalle: `Tu páncreas aún tiene capacidad de recuperación significativa, aún cuando tu hemoglobina glicosilada está en ${hba1cRange}.\n\n¡Y esta es una excelente noticia: estás a tiempo de revertir tu condición!\n\nCon las herramientas adecuadas, puedes apuntar hacia una reversión completa de tu enfermedad y evitar la progresión hacia más medicamentos y complicaciones de la misma.\n\nEs sin duda el mejor momento para actuar si quieres vivir libre de enfermedad.`,
          mostrarBoton: true, ctaUrl: 'https://www.somosplantpowered.com/vsl-piad'
        };
      } else {
        return {
          score, categoría: 'Pronóstico Intermedio', etiqueta: 'Prospecto_Formulario_free', mensaje: '⚠️ PRONÓSTICO DE REVERSIÓN INTERMEDIO',
          detalle: `Tu páncreas aún tiene capacidad de recuperación significativa, aún cuando tu hemoglobina glicosilada está en ${hba1cRange}.\n\n¡Y esta es una excelente noticia: estás a tiempo de revertir tu condición!\n\nCon las herramientas adecuadas, puedes apuntar hacia una reversión completa de tu enfermedad y evitar la progresión hacia más medicamentos y complicaciones de la misma.\n\nEs sin duda el mejor momento para actuar si quieres vivir libre de enfermedad.`,
          mostrarBoton: true, ctaUrl: '#'
        };
      }
    } else {
      return {
        score, categoría: 'Riesgo Metabólico Elevado', etiqueta: null, mensaje: '🚨 RIESGO METABÓLICO ELEVADO',
        detalle: 'Como estás usando insulina, sabemos que la función de tu páncreas ya se ha deteriorado. En este estado, nuestro enfoque no sería la reversión, sino enfocarnos en mejorar significativamente tu calidad de vida y prevenir complicaciones a largo plazo.\n\nEsto requiere un seguimiento médico especializado y un control nutricional riguroso que optimice tu respuesta metabólica al máximo posible.\n\nPor ello, te recomendamos que busques asesoría con un especialista en diabetes que pueda brindarte el seguimiento personalizado que necesitas. Nuestro programa de reversión no es el mejor fit para tu situación en este momento.\n\nTe deseamos éxitos en el cuidado de tu salud.',
        mostrarBoton: false, ctaUrl: null
      };
    }
  }, [formData, calculateScore]);

  const enviarASysteme = async () => {
    try {
      const segmento = getSegmento();
      const payload = { nombre: formData.nombre, correo: formData.correo, whatsapp: formData.whatsapp, instagram: formData.instagram, país: formData.país, score: segmento.score, categoría: segmento.categoría, etiqueta: segmento.etiqueta, emoción: formData.emoción, presupuesto: formData.presupuesto };
      await fetch('https://script.google.com/macros/s/AKfycbyKqMdOp87yjc1ORqopG-o2U60VDbyVbqnIUjV8tmOZKHZziILdUaZuKk9YD7xsxcHZGQ/exec', { method: 'POST', body: JSON.stringify(payload) });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNext = async () => {
    if (!canAdvance()) {
      alert('Por favor completa todos los campos');
      return;
    }
    if (step === 10) {
      setLoading(true);
      await enviarASysteme();
      const segmento = getSegmento();
      setResultado(segmento);
      setLoading(false);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (resultado) {
    return <div style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}><div style={{ maxWidth: '600px', width: '100%', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}><img src="https://i.imgur.com/JQFiMig.png" alt="Somos Plant Powered" style={{ maxWidth: '100px', marginBottom: '30px' }} /><h1 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '20px' }}>{resultado.mensaje}</h1><div style={{ whiteSpace: 'pre-wrap', fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6', textAlign: 'center' }}>{resultado.detalle}</div>{resultado.mostrarBoton && <><div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}><p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Tu próximo paso</p><p style={{ fontSize: '18px', color: '#3d6d3f', fontWeight: 'bold', margin: 0 }}>{resultado.categoría === 'Riesgo Metabólico Elevado' ? 'Seguimiento médico especializado' : 'Iniciar un proceso de reversión'}</p></div><p style={{ fontSize: '14px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}><strong>Haz clic abajo para ver un video donde te explico exactamente qué hacer para lograr revertir tu condición.</strong> Te mostraré el paso a paso para conseguir este resultado.</p><a href={resultado.ctaUrl} style={{ display: 'inline-block', background: '#C85D1A', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Ver Metodología de Reversión →</a></>}</div></div>;
  }

  return <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '20px' }}><div style={{ maxWidth: '600px', margin: '0 auto' }}><div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '30px' }}><img src="https://i.imgur.com/JQFiMig.png" alt="Somos Plant Powered" style={{ maxWidth: '100px', marginBottom: '20px' }} /><h1 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '10px' }}>Calcula tu pronóstico de reversión</h1><p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>Responde este breve formulario y descubre qué tan cerca podrías estar de revertir tu resistencia a la insulina, prediabetes o diabetes tipo 2.</p></div><div style={{ marginBottom: '30px', textAlign: 'right', fontSize: '14px', color: '#999' }}>{step + 1}/11</div><div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><h2 style={{ fontSize: '18px', color: '#1a1a1a', marginBottom: '20px', fontWeight: 'bold' }}>{step === 0 && 'Información General'}{step === 1 && '¿Qué edad tienes?'}{step === 2 && '¿Cuál es tu diagnóstico actual?'}{step === 3 && '¿Hace cuánto tiempo recibiste tu diagnóstico?'}{step === 4 && '¿Cuál fue tu última hemoglobina glicosilada (HbA1c)?'}{step === 5 && '¿Utilizas actualmente alguno de los siguientes?'}{step === 6 && '¿Cómo te sientes respecto a tu salud actualmente?'}{step === 7 && '¿Qué es lo que MÁS te preocupa si esta condición sigue avanzando?'}{step === 8 && '¿Qué es lo que MÁS te gustaría lograr?'}{step === 9 && '¿Qué tan comprometido(a) estás con transformar tu salud?'}{step === 10 && 'Si tuvieras la certeza de que puedes revertir tu condición, ¿qué presupuesto destinarías para lograr este objetivo?'}</h2>{step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><input type="text" placeholder="Tu nombre completo" value={formData.nombre} onChange={(e) => updateForm('nombre', e.target.value)} style={{ padding: '16px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px' }} /><input type="email" placeholder="Tu correo" value={formData.correo} onChange={(e) => updateForm('correo', e.target.value)} style={{ padding: '16px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px' }} /><input type="text" placeholder="Tu usuario de Instagram (sin @)" value={formData.instagram} onChange={(e) => updateForm('instagram', e.target.value)} style={{ padding: '16px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px' }} /><input type="tel" placeholder="WhatsApp (+código país y número)" value={formData.whatsapp} onChange={(e) => updateForm('whatsapp', e.target.value)} style={{ padding: '16px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px' }} /><input type="text" placeholder="País de residencia" value={formData.país} onChange={(e) => updateForm('país', e.target.value)} style={{ padding: '16px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px' }} /></div>}{step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: '<40', l: 'Menos de 40' }, { v: '40-55', l: '40–55' }, { v: '56-70', l: '56–70' }, { v: '>70', l: 'Más de 70' }].map(o => <button key={o.v} onClick={() => updateForm('edad', o.v)} style={{ padding: '14px', border: formData.edad === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.edad === o.v ? '#3d6d3f' : 'white', color: formData.edad === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'Resistencia', l: 'Resistencia a la insulina' }, { v: 'Prediabetes', l: 'Prediabetes' }, { v: 'Diabetes2', l: 'Diabetes tipo 2' }, { v: 'NoSeguro', l: 'No estoy seguro(a)' }].map(o => <button key={o.v} onClick={() => updateForm('diagnóstico', o.v)} style={{ padding: '14px', border: formData.diagnóstico === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.diagnóstico === o.v ? '#3d6d3f' : 'white', color: formData.diagnóstico === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: '<1año', l: 'Menos de 1 año' }, { v: '1-5años', l: 'Entre 1 y 5 años' }, { v: '>5años', l: 'Más de 5 años' }, { v: 'NoConfirmado', l: 'No tengo un diagnóstico confirmado' }].map(o => <button key={o.v} onClick={() => updateForm('tiempodiagnóstico', o.v)} style={{ padding: '14px', border: formData.tiempodiagnóstico === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.tiempodiagnóstico === o.v ? '#3d6d3f' : 'white', color: formData.tiempodiagnóstico === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 4 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: '<5.7', l: 'Menos de 5.7%' }, { v: '5.7-6.4', l: '5.7–6.4%' }, { v: '6.5-7.0', l: '6.5–7.0%' }, { v: '>7.0', l: 'Más de 7.0%' }, { v: 'NoSé', l: 'No lo sé' }].map(o => <button key={o.v} onClick={() => updateForm('hba1c', o.v)} style={{ padding: '14px', border: formData.hba1c === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.hba1c === o.v ? '#3d6d3f' : 'white', color: formData.hba1c === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 5 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'Ninguno', l: 'Ningún medicamento' }, { v: '1oral', l: '1 medicamento oral' }, { v: '2+orales', l: '2 o más medicamentos orales' }, { v: 'Orales+Insulina', l: 'Medicamento(s) orales + insulina inyectada' }, { v: 'Insulina', l: 'Insulina inyectada' }].map(o => <button key={o.v} onClick={() => updateForm('medicamentos', o.v)} style={{ padding: '14px', border: formData.medicamentos === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.medicamentos === o.v ? '#3d6d3f' : 'white', color: formData.medicamentos === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 6 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'Tranquilo', l: 'Tranquilo(a), pero quiero prevenir problemas futuros' }, { v: 'Preocupado', l: 'Preocupado(a), siento que necesito actuar pronto' }, { v: 'Frustrado', l: 'Frustrado(a), he intentado muchas cosas sin éxito' }, { v: 'Abrumado', l: 'Abrumado(a), siento que estoy perdiendo el control de mi salud' }].map(o => <button key={o.v} onClick={() => updateForm('emoción', o.v)} style={{ padding: '14px', border: formData.emoción === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.emoción === o.v ? '#3d6d3f' : 'white', color: formData.emoción === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 7 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'Medicamentos', l: 'Seguir aumentando medicamentos' }, { v: 'Insulina', l: 'Tener que usar insulina' }, { v: 'Complicaciones', l: 'Desarrollar complicaciones de la enfermedad' }, { v: 'CalidadVida', l: 'Perder calidad de vida' }, { v: 'Familia', l: 'No poder disfrutar plenamente de mi familia y mi futuro' }].map(o => <button key={o.v} onClick={() => updateForm('preocupación', o.v)} style={{ padding: '14px', border: formData.preocupación === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.preocupación === o.v ? '#3d6d3f' : 'white', color: formData.preocupación === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 8 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'ReducirMedicamentos', l: 'Reducir medicamentos' }, { v: 'BajarGlucosa', l: 'Bajar mi glucosa' }, { v: 'MasEnergia', l: 'Tener más energía' }, { v: 'PesoPerder', l: 'Perder peso' }, { v: 'RevertirCondicion', l: 'Revertir mi condición' }].map(o => <button key={o.v} onClick={() => updateForm('objetivo', o.v)} style={{ padding: '14px', border: formData.objetivo === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.objetivo === o.v ? '#3d6d3f' : 'white', color: formData.objetivo === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 9 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'Listo', l: 'Estoy listo(a) para hacer cambios importantes' }, { v: 'Dudas', l: 'Aún tengo dudas' }, { v: 'Explorando', l: 'Solo estoy explorando opciones' }].map(o => <button key={o.v} onClick={() => updateForm('compromiso', o.v)} style={{ padding: '14px', border: formData.compromiso === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.compromiso === o.v ? '#3d6d3f' : 'white', color: formData.compromiso === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}{step === 10 && <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[{ v: 'NoPodría', l: 'No podría invertir en este momento' }, { v: '$1-2.5k', l: '$1000 - $2500 USD' }, { v: '$2.5-5k', l: '$2501 - $5000 USD' }, { v: '$5-10k', l: '$5001 - $10000 USD' }, { v: '>$10k', l: '> 10000 USD' }].map(o => <button key={o.v} onClick={() => updateForm('presupuesto', o.v)} style={{ padding: '14px', border: formData.presupuesto === o.v ? '2px solid #3d6d3f' : '2px solid #ddd', background: formData.presupuesto === o.v ? '#3d6d3f' : 'white', color: formData.presupuesto === o.v ? 'white' : '#1a1a1a', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{o.l}</button>)}</div>}<div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}><button onClick={handlePrev} disabled={step === 0} style={{ flex: 1, padding: '14px', background: step === 0 ? '#f0f0f0' : 'white', border: '2px solid #ddd', borderRadius: '10px', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Atrás</button><button onClick={handleNext} disabled={loading || !canAdvance()} style={{ flex: 1, padding: '14px', background: loading || !canAdvance() ? '#ccc' : '#3d6d3f', color: 'white', border: 'none', borderRadius: '10px', cursor: loading || !canAdvance() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{step === 10 ? 'Ver Resultado' : 'Siguiente'}</button></div></div></div></div>;
}
