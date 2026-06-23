'use client';

import React, { useState, useCallback } from 'react';

export default function ReversalQuiz() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
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

  const puntajes = {
    edad: { '<40': 2, '40-55': 2, '56-70': 1, '>70': 0 },
    diagnóstico: { 'Resistencia': 4, 'Prediabetes': 4, 'Diabetes2': 3, 'NoSeguro': 1 },
    tiempodiagnóstico: { '<1': 4, '1-5': 4, '>5': 3, 'NoConfirmado': 2 },
    hba1c: { '<5.7': 4, '5.7-6.4': 3, '6.5-7.0': 2, '>7.0': 0, 'NoSé': 1 },
    medicamentos: { 'Ninguno': 4, '1Oral': 3, '2Orales': 2, 'Insulina': 'exclusion' },
    compromiso: { 'Listo': 4, 'Dudas': 2, 'Explorando': 0 }
  };

  const calcularScore = useCallback(() => {
    let score = 0;
    let exclusion = false;

    if (formData.medicamentos === 'Insulina') {
      exclusion = true;
    }

    if (!exclusion) {
      score += puntajes.edad[formData.edad] || 0;
      score += puntajes.diagnóstico[formData.diagnóstico] || 0;
      score += puntajes.tiempodiagnóstico[formData.tiempodiagnóstico] || 0;
      score += puntajes.hba1c[formData.hba1c] || 0;
      score += puntajes.medicamentos[formData.medicamentos] || 0;
    }

    return { score, exclusion };
  }, [formData]);

  const getSegmento = useCallback(() => {
    const { score, exclusion } = calcularScore();
    const tieneAltaInversión = formData.presupuesto && formData.presupuesto !== 'NoPodría';

    if (exclusion) {
      return {
        categoría: 'RIESGO METABÓLICO ELEVADO',
        score: score,
        mensaje: 'Tu prioridad debe ser optimizar el control metabólico y prevenir complicaciones.',
        detalles: 'Aunque la reversión completa no es el objetivo principal en este momento, puedes mejorar significativamente tu calidad de vida. Te recomiendo trabajar con un médico especialista y nutricionista para un seguimiento cercano y personalizado.',
        acción: 'medical',
        etiqueta: null,
        siguientePaso: 'Seguimiento médico y nutricional especializado'
      };
    }

    if (score >= 15) {
      if (tieneAltaInversión) {
        return {
          categoría: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          score: score,
          mensaje: 'Tienes excelentes características para revertir tu condición.',
          detalles: 'Tu perfil metabólico muestra una alta probabilidad de responder a un proceso de reversión al implementar cambios de manera inmediata. Si quieres conocer mi metodología de reversión paso a paso, haz clic en el botón de abajo.',
          acción: 'vsl',
          etiqueta: 'Prospecto_VSL',
          siguientePaso: 'Acceso al programa premium de reversión'
        };
      } else {
        return {
          categoría: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          score: score,
          mensaje: 'Tienes excelentes características para revertir tu condición.',
          detalles: 'Tu perfil metabólico muestra una alta probabilidad de responder a cambios de manera inmediata. Hemos preparado recursos gratuitos para que comiences tu transformación hoy mismo.',
          acción: 'free',
          etiqueta: 'Prospecto_Free',
          siguientePaso: 'Ebook gratuito + Training "Domina tu Glucosa" (10 días)'
        };
      }
    }

    if (score >= 10) {
      if (tieneAltaInversión) {
        return {
          categoría: '⚠️ PRONÓSTICO INTERMEDIO DE REVERSIÓN',
          score: score,
          mensaje: 'Puedes lograr mejoras significativas con acompañamiento especializado.',
          detalles: 'Muchas personas en tu rango logran reducir medicamentos y normalizar sus niveles de glucosa. Mi programa está diseñado específicamente para ti. Haz clic para conocer la metodología completa.',
          acción: 'vsl',
          etiqueta: 'Prospecto_VSL',
          siguientePaso: 'Acceso al programa premium de reversión'
        };
      } else {
        return {
          categoría: '⚠️ PRONÓSTICO INTERMEDIO DE REVERSIÓN',
          score: score,
          mensaje: 'Puedes lograr mejoras significativas con acompañamiento especializado.',
          detalles: 'Muchas personas en tu rango logran cambios positivos. Comienza con nuestro ebook gratuito y training exclusivo para aprender la metodología que uso con mis pacientes.',
          acción: 'free',
          etiqueta: 'Prospecto_Free',
          siguientePaso: 'Ebook gratuito + Training "Domina tu Glucosa" (10 días)'
        };
      }
    }

    return {
      categoría: '🚨 RIESGO METABÓLICO ELEVADO',
      score: score,
      mensaje: 'Tu prioridad debe ser optimizar el control metabólico y prevenir complicaciones.',
      detalles: 'Aunque la reversión completa no es el objetivo principal en este momento, puedes mejorar significativamente tu calidad de vida. Te recomiendo trabajar con un médico especialista y nutricionista para un seguimiento cercano y personalizado.',
      acción: 'medical',
      etiqueta: null,
      siguientePaso: 'Seguimiento médico y nutricional especializado'
    };
  }, [formData, calcularScore]);

  const enviarASysteme = async () => {
    try {
      const segmento = getSegmento();

      const payload = {
        email: formData.correo,
        firstName: formData.nombre.split(' ')[0] || 'Lead',
        lastName: formData.nombre.split(' ').slice(1).join(' ') || '',
        phone: '',
        custom_fields: {
          instagram: formData.instagram,
          país: formData.país,
          edad: formData.edad,
          diagnóstico: formData.diagnóstico,
          score_reversión: String(segmento.score),
          categoría: segmento.categoría,
          emoción_actual: formData.emoción,
          presupuesto: formData.presupuesto,
          timestamp: new Date().toISOString()
        },
        tags: segmento.etiqueta ? [segmento.etiqueta] : []
      };

      const response = await fetch('https://systeme.io/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer xu6nsy7sfz9qzzrxjbrc00xe306rgb3p0x63b6geqtokeyfv9s6g9m6a9k6tzw0s`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('API Response:', response.status);
      }

      return true;
    } catch (error) {
      console.error('Error enviando a Systeme.io:', error);
      return true;
    }
  };

  const handleNext = async () => {
    if (step === 10) {
      setLoading(true);
      await enviarASysteme();
      setLoading(false);

      const segmento = getSegmento();
      setResultado(segmento);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (resultado) {
    return (
      <div style={{ padding: '2rem 1rem', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>
            Tu Pronóstico
          </h1>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Análisis completado y guardado en nuestro sistema
          </p>
        </div>

        <div style={{
          background: resultado.acción === 'vsl' || resultado.acción === 'free' ? 'rgba(45, 127, 94, 0.08)' : 'rgba(216, 90, 48, 0.08)',
          border: resultado.acción === 'vsl' || resultado.acción === 'free' ? '1px solid rgba(45, 127, 94, 0.3)' : '1px solid rgba(216, 90, 48, 0.3)',
          borderRadius: '12px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '56px', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>
            {resultado.score}
            <span style={{ fontSize: '24px', color: '#999', marginLeft: '0.5rem' }}>/18</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '1rem', color: '#333', margin: '1rem 0 0 0' }}>
            {resultado.categoría}
          </h2>
          <p style={{ color: '#333', fontSize: '15px', lineHeight: 1.6, margin: '1rem 0 0 0' }}>
            {resultado.mensaje}
          </p>
          <p style={{ color: '#999', fontSize: '14px', lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
            {resultado.detalles}
          </p>
        </div>

        <div style={{ background: '#f3f3f3', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', fontSize: '12px', fontWeight: 500, margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
            Tu próximo paso
          </p>
          <p style={{ color: '#333', fontSize: '16px', fontWeight: 500, margin: 0 }}>
            {resultado.siguientePaso}
          </p>
        </div>

        {resultado.acción === 'vsl' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px'
