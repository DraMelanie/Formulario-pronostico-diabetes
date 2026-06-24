'use client';

import React, { useState, useCallback } from 'react';

export default function ReversalQuiz() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    whatsapp: '',
    instagram: '',
    país: '',
    edad: null,
    diagnóstico: null,
    tiempodiagnóstico: null,
    hba1c: null,
    medicamentos: null,
    emoción: '',
    preocupación: '',
    objetivo: '',
    compromiso: null,
    presupuesto: null
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateScore = useCallback(() => {
    let score = 0;

    if (formData.edad === '<40') score += 2;
    else if (formData.edad === '40-55') score += 2;
    else if (formData.edad === '56-70') score += 1;
    else if (formData.edad === '>70') score += 0;

    if (formData.diagnóstico === 'Resistencia') score += 4;
    else if (formData.diagnóstico === 'Prediabetes') score += 4;
    else if (formData.diagnóstico === 'Diabetes2') score += 3;
    else if (formData.diagnóstico === 'NoSeguro') score += 1;

    if (formData.tiempodiagnóstico === '<1año') score += 4;
    else if (formData.tiempodiagnóstico === '1-5años') score += 4;
    else if (formData.tiempodiagnóstico === '>5años') score += 3;
    else if (formData.tiempodiagnóstico === 'NoConfirmado') score += 2;

    if (formData.hba1c === '<5.7') score += 4;
    else if (formData.hba1c === '5.7-6.4') score += 3;
    else if (formData.hba1c === '6.5-7.0') score += 2;
    else if (formData.hba1c === '>7.0') score += 0;
    else if (formData.hba1c === 'NoSé') score += 1;

    if (formData.medicamentos === 'Ninguno') score += 4;
    else if (formData.medicamentos === '1oral') score += 3;
    else if (formData.medicamentos === '2+orales') score += 2;
    else if (formData.medicamentos === 'Insulina') score = -1;

    if (formData.compromiso === 'Listo') score += 4;
    else if (formData.compromiso === 'Dudas') score += 2;
    else if (formData.compromiso === 'Explorando') score += 0;

    return score;
  }, [formData]);

  const getSegmento = useCallback(() => {
    const score = calculateScore();

    if (formData.medicamentos === 'Insulina') {
      return {
        score: 'Insulina',
        categoría: 'Riesgo Metabólico Elevado',
        etiqueta: null,
        mensaje: '🚨 RIESGO METABÓLICO ELEVADO',
        detalle: 'Recomendamos seguimiento médico y nutricional especializado.',
        cta: 'Seguimiento médico',
        ctaUrl: null
      };
    }

    if (score >= 15) {
      if (formData.presupuesto && formData.presupuesto !== 'NoPodría') {
        return {
          score: score,
          categoría: 'Alto Pronóstico',
          etiqueta: 'Prospecto_Formulario_VSL',
          mensaje: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          detalle: 'Tu perfil indica excelente potencial para revertir tu resistencia a insulina.',
          cta: 'Ver Metodología de Reversión',
          ctaUrl: 'https://www.somosplantpowered.com/vsl-piad'
        };
      } else {
        return {
          score: score,
          categoría: 'Alto Pronóstico',
          etiqueta: 'Prospecto_Formulario_free',
          mensaje: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          detalle: 'Tu perfil indica excelente potencial. Obtén nuestro ebook gratuito.',
          cta: 'Descargar Ebook Gratuito',
          ctaUrl: '#'
        };
      }
    } else if (score >= 10 && score < 15) {
      if (formData.presupuesto && formData.presupuesto !== 'NoPodría') {
        return {
          score: score,
          categoría: 'Pronóstico Intermedio',
          etiqueta: 'Prospecto_Formulario_VSL',
          mensaje: '⚠️ PRONÓSTICO INTERMEDIO',
          detalle: 'Tu perfil muestra potencial moderado. Podemos ayudarte a mejorarlo.',
          cta: 'Ver Metodología de Reversión',
          ctaUrl: 'https://www.somosplantpowered.com/vsl-piad'
        };
      } else {
        return {
          score: score,
          categoría: 'Pronóstico Intermedio',
          etiqueta: 'Prospecto_Formulario_free',
          mensaje: '⚠️ PRONÓSTICO INTERMEDIO',
          detalle: 'Tu perfil muestra potencial moderado. Accede a nuestro ebook.',
          cta: 'Ebook Gratuito + Training',
          ctaUrl: '#'
        };
      }
    } else {
      return {
        score: score,
        categoría: 'Riesgo Metabólico Elevado',
        etiqueta: null,
        mensaje: '🚨 RIESGO METABÓLICO ELEVADO',
        detalle: 'Recomendamos seguimiento médico y nutricional especializado.',
        cta: 'Seguimiento médico',
        ctaUrl: null
      };
    }
  }, [formData.medicamentos, formData.presupuesto, calculateScore]);

  const enviarASysteme = async () => {
    try {
      const segmento = getSegmento();

      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        país: formData.país,
        score: segmento.score,
        categoría: segmento.categoría,
        etiqueta: segmento.etiqueta,
        emoción: formData.emoción,
        presupuesto: formData.presupuesto
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycbyKqMdOp87yjc1ORqopG-o2U60VDbyVbqnIUjV8tmOZKHZziILdUaZuKk9YD7xsxcHZGQ/exec', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return true;
    } catch (error) {
      console.error('Error:', error);
      return true;
    }
  };
const handleNext = async () => {
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
    return (
      <div style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <img src="https://i.imgur.com/JQFiMig.png" alt="Somos Plant Powered" style={{ maxWidth: '200px', marginBottom: '30px' }} />
          <h1 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '20px' }}>
            {resultado.mensaje}
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
            {resultado.detalle}
          </p>
          <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>Tu próximo paso</p>
            <p style={{ fontSize: '18px', color: '#3d6d3f', fontWeight: 'bold' }}>
              {resultado.categoría === 'Riesgo Metabólico Elevado' 
                ? 'Seguimiento médico y nutricional especializado'
                : resultado.etiqueta === 'Prospecto_Formulario_VSL'
                ? 'Iniciar un proceso de reversión'
                : 'Ebook gratuito + Training "Domina tu Glucosa" (10 días)'}
            </p>
          </div>
          {resultado.ctaUrl && (
            <a
              href={resultado.ctaUrl}
              style={{
                display: 'inline-block',
                background: '#3d6d3f',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '20px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#2d5a30'}
              onMouseLeave={(e) => e.target.style.background = '#3d6d3f'}
            >
              {resultado.cta} →
            </a>
          )}
          <p style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
            Nos pondremos en contacto en las próximas 24 horas para acompañarte en tu proceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '30px' }}>
          <img src="https://i.imgur.com/JQFiMig.png" alt="Somos Plant Powered" style={{ maxWidth: '150px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '10px' }}>Calcula tu pronóstico de reversión</h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            Responde este breve formulario y descubre qué tan cerca podrías estar de revertir tu resistencia a la insulina, prediabetes o diabetes tipo 2.
          </p>
        </div>

        <div style={{ marginBottom: '30px', textAlign: 'right', fontSize: '14px', color: '#999' }}>
          {step + 1}/11
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', color: '#1a1a1a', marginBottom: '20px', fontWeight: 'bold' }}>
            {step === 0 && 'Información General'}
            {step === 1 && '¿Cuál es tu edad?'}
            {step === 2 && '¿Cuál es tu diagnóstico?'}
            {step === 3 && '¿Cuánto tiempo llevas con este diagnóstico?'}
            {step === 4 && '¿Cuál es tu HbA1c?'}
            {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'Ninguno', label: 'Ningún medicamento' },
                { val: '1oral', label: '1 medicamento oral' },
                { val: '2+orales', label: '2 o más medicamentos orales' },
                { val: 'Orales+Insulina', label: 'Medicamento(s) orales + insulina inyectada' },
                { val: 'Insulina', label: 'Insulina inyectada' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('medicamentos', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.medicamentos === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.medicamentos === opt.val ? '#3d6d3f' : 'white',
                    color: formData.medicamentos === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

            {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'Tranquilo', label: 'Tranquilo(a), pero quiero prevenir problemas futuros' },
                { val: 'Preocupado', label: 'Preocupado(a), siento que necesito actuar pronto' },
                { val: 'Frustrado', label: 'Frustrado(a), he intentado muchas cosas sin éxito' },
                { val: 'Abrumado', label: 'Abrumado(a), siento que estoy perdiendo el control de mi salud' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('emoción', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.emoción === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.emoción === opt.val ? '#3d6d3f' : 'white',
                    color: formData.emoción === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'Medicamentos', label: 'Seguir aumentando medicamentos' },
                { val: 'Insulina', label: 'Tener que usar insulina' },
                { val: 'Complicaciones', label: 'Desarrollar complicaciones de la enfermedad' },
                { val: 'CalidadVida', label: 'Perder calidad de vida' },
                { val: 'Familia', label: 'No poder disfrutar plenamente de mi familia y mi futuro' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('preocupación', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.preocupación === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.preocupación === opt.val ? '#3d6d3f' : 'white',
                    color: formData.preocupación === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 8 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'ReducirMedicamentos', label: 'Reducir medicamentos' },
                { val: 'BajarGlucosa', label: 'Bajar mi glucosa' },
                { val: 'MasEnergia', label: 'Tener más energía' },
                { val: 'PesoPerder', label: 'Perder peso' },
                { val: 'RevertirCondicion', label: 'Revertir mi condición' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('objetivo', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.objetivo === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.objetivo === opt.val ? '#3d6d3f' : 'white',
                    color: formData.objetivo === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 9 &&
            {step === 9 && '¿Qué tan listo/a estás?'}
            {step === 10 && '¿Cuál es tu capacidad de inversión?'}
          </h2>

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={(e) => updateForm('nombre', e.target.value)}
                style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <input
                type="email"
                placeholder="Tu correo"
                value={formData.correo}
                onChange={(e) => updateForm('correo', e.target.value)}
                style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <input
                type="text"
                placeholder="Tu usuario de Instagram (sin @)"
                value={formData.instagram}
                onChange={(e) => updateForm('instagram', e.target.value)}
                style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <input
                type="text"
                placeholder="WhatsApp (+código país y número)"
                value={formData.whatsapp}
                onChange={(e) => updateForm('whatsapp', e.target.value)}
                style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <input
                type="text"
                placeholder="País de residencia"
                value={formData.país}
                onChange={(e) => updateForm('país', e.target.value)}
                style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['<40', '40-55', '56-70', '>70'].map(opt => (
                <button
                  key={opt}
                  onClick={() => updateForm('edad', opt)}
                  style={{
                    padding: '14px',
                    border: formData.edad === opt ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.edad === opt ? '#3d6d3f' : 'white',
                    color: formData.edad === opt ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'Resistencia', label: 'Resistencia a la insulina' },
                { val: 'Prediabetes', label: 'Prediabetes' },
                { val: 'Diabetes2', label: 'Diabetes tipo 2' },
                { val: 'NoSeguro', label: 'No estoy seguro' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('diagnóstico', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.diagnóstico === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.diagnóstico === opt.val ? '#3d6d3f' : 'white',
                    color: formData.diagnóstico === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: '<1año', label: 'Menos de 1 año' },
                { val: '1-5años', label: '1 a 5 años' },
                { val: '>5años', label: 'Más de 5 años' },
                { val: 'NoConfirmado', label: 'No confirmado aún' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('tiempodiagnóstico', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.tiempodiagnóstico === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.tiempodiagnóstico === opt.val ? '#3d6d3f' : 'white',
                    color: formData.tiempodiagnóstico === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: '<5.7', label: 'Menos de 5.7%' },
                { val: '5.7-6.4', label: '5.7% - 6.4%' },
                { val: '6.5-7.0', label: '6.5% - 7.0%' },
                { val: '>7.0', label: 'Mayor a 7.0%' },
                { val: 'NoSé', label: 'No sé mi HbA1c' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('hba1c', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.hba1c === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.hba1c === opt.val ? '#3d6d3f' : 'white',
                    color: formData.hba1c === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'Ninguno', label: 'Ninguno' },
                { val: '1oral', label: '1 medicamento oral' },
                { val: '2+orales', label: '2 o más medicamentos orales' },
                { val: 'Insulina', label: 'Insulina inyectada' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('medicamentos', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.medicamentos === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.medicamentos === opt.val ? '#3d6d3f' : 'white',
                    color: formData.medicamentos === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 6 && (
            <input
              type="text"
              placeholder="¿Cómo te sientes? (ej: asustado, motivado, confundido)"
              value={formData.emoción}
              onChange={(e) => updateForm('emoción', e.target.value)}
              style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
            />
          )}

          {step === 7 && (
            <input
              type="text"
              placeholder="¿Qué te preocupa más? (ej: complicaciones, cambio de estilo de vida)"
              value={formData.preocupación}
              onChange={(e) => updateForm('preocupación', e.target.value)}
              style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
            />
          )}

          {step === 8 && (
            <input
              type="text"
              placeholder="¿Cuál es tu objetivo? (ej: normalizar glucosa, dejar medicinas)"
              value={formData.objetivo}
              onChange={(e) => updateForm('objetivo', e.target.value)}
              style={{ padding: '16px 14px', borderRadius: '10px', border: '2px solid #ddd', fontSize: '16px', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
            />
          )}

          {step === 9 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'Listo', label: 'Sí, estoy listo/a para cambiar' },
                { val: 'Dudas', label: 'Tengo dudas, pero quiero intentar' },
                { val: 'Explorando', label: 'Aún estoy explorando opciones' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('compromiso', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.compromiso === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.compromiso === opt.val ? '#3d6d3f' : 'white',
                    color: formData.compromiso === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 10 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { val: 'NoPodría', label: 'No podría invertir ahora' },
                { val: '$1-2.5k', label: '$1,000 - $2,500' },
                { val: '$2.5-5k', label: '$2,500 - $5,000' },
                { val: '$5-10k', label: '$5,000 - $10,000' },
                { val: '>$10k', label: 'Más de $10,000' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateForm('presupuesto', opt.val)}
                  style={{
                    padding: '14px',
                    border: formData.presupuesto === opt.val ? '2px solid #3d6d3f' : '2px solid #ddd',
                    background: formData.presupuesto === opt.val ? '#3d6d3f' : 'white',
                    color: formData.presupuesto === opt.val ? 'white' : '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
            <button
              onClick={handlePrev}
              disabled={step === 0}
              style={{
                flex: 1,
                padding: '14px',
                border: '2px solid #ddd',
                background: step === 0 ? '#f0f0f0' : 'white',
                color: step === 0 ? '#ccc' : '#1a1a1a',
                borderRadius: '10px',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Atrás
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: loading ? '#ccc' : '#3d6d3f',
                color: 'white',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.background = '#2d5a30')}
              onMouseLeave={(e) => !loading && (e.target.style.background = '#3d6d3f')}
            >
              {step === 10 ? 'Ver Resultado' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
