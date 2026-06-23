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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="https://www.somosplantpowered.com/vsl-piad" style={{
              display: 'block',
              background: '#378ADD',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer'
            }}>
              Ver Metodología de Reversión →
            </a>
            <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', margin: 0 }}>
              Recibirás un email con todos los detalles
            </p>
          </div>
        )}

        {resultado.acción === 'free' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              background: '#378ADD',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '15px'
            }}>
              Descargar Ebook Gratuito →
            </button>
            <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', margin: 0 }}>
              + Acceso al training "Domina tu Glucosa" (10 días)
            </p>
          </div>
        )}

        {resultado.acción === 'medical' && (
          <div style={{ background: 'rgba(216, 90, 48, 0.08)', border: '1px solid rgba(216, 90, 48, 0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ color: '#333', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              <strong>Te recomendamos trabajar con un médico especialista y nutricionista</strong> para un seguimiento cercano y personalizado.
            </p>
          </div>
        )}
      </div>
    );
  }

  const steps = [
    {
      title: 'Información General',
      fields: ['nombre', 'correo', 'instagram', 'país']
    },
    {
      title: '¿Qué edad tienes?',
      field: 'edad',
      options: [
        { label: 'Menos de 40', value: '<40' },
        { label: '40–55', value: '40-55' },
        { label: '56–70', value: '56-70' },
        { label: 'Más de 70', value: '>70' }
      ]
    },
    {
      title: '¿Cuál es tu diagnóstico actual?',
      field: 'diagnóstico',
      options: [
        { label: 'Resistencia a la insulina', value: 'Resistencia' },
        { label: 'Prediabetes', value: 'Prediabetes' },
        { label: 'Diabetes tipo 2', value: 'Diabetes2' },
        { label: 'No estoy seguro(a)', value: 'NoSeguro' }
      ]
    },
    {
      title: '¿Hace cuánto tiempo recibiste tu diagnóstico?',
      field: 'tiempodiagnóstico',
      options: [
        { label: 'Menos de 1 año', value: '<1' },
        { label: 'Entre 1 y 5 años', value: '1-5' },
        { label: 'Más de 5 años', value: '>5' },
        { label: 'No tengo diagnóstico confirmado', value: 'NoConfirmado' }
      ]
    },
    {
      title: '¿Cuál fue tu última hemoglobina glicosilada (HbA1c)?',
      field: 'hba1c',
      options: [
        { label: 'Menos de 5.7%', value: '<5.7' },
        { label: '5.7–6.4%', value: '5.7-6.4' },
        { label: '6.5–7.0%', value: '6.5-7.0' },
        { label: 'Más de 7.0%', value: '>7.0' },
        { label: 'No lo sé', value: 'NoSé' }
      ]
    },
    {
      title: '¿Utilizas actualmente alguno de los siguientes?',
      field: 'medicamentos',
      options: [
        { label: 'Ningún medicamento', value: 'Ninguno' },
        { label: '1 medicamento oral', value: '1Oral' },
        { label: '2 o más medicamentos orales', value: '2Orales' },
        { label: 'Insulina inyectada', value: 'Insulina' }
      ]
    },
    {
      title: '¿Cómo te sientes respecto a tu salud actualmente?',
      field: 'emoción',
      options: [
        { label: 'Tranquilo(a), pero quiero prevenir problemas futuros', value: 'Tranquilo' },
        { label: 'Preocupado(a), siento que necesito actuar pronto', value: 'Preocupado' },
        { label: 'Frustrado(a), he intentado muchas cosas sin éxito', value: 'Frustrado' },
        { label: 'Abrumado(a), siento que estoy perdiendo el control', value: 'Abrumado' }
      ]
    },
    {
      title: '¿Qué es lo que MÁS te preocupa si esta condición sigue avanzando?',
      field: 'preocupación',
      options: [
        { label: 'Seguir aumentando medicamentos', value: 'Medicamentos' },
        { label: 'Tener que usar insulina', value: 'Insulina' },
        { label: 'Desarrollar complicaciones de la enfermedad', value: 'Complicaciones' },
        { label: 'Perder calidad de vida', value: 'Calidad' },
        { label: 'No poder disfrutar plenamente de mi familia y mi futuro', value: 'Familia' }
      ]
    },
    {
      title: '¿Qué es lo que MÁS te gustaría lograr?',
      field: 'objetivo',
      options: [
        { label: 'Reducir medicamentos', value: 'Reducir' },
        { label: 'Bajar mi glucosa', value: 'Glucosa' },
        { label: 'Tener más energía', value: 'Energía' },
        { label: 'Perder peso', value: 'Peso' },
        { label: 'Revertir mi condición', value: 'Revertir' }
      ]
    },
    {
      title: '¿Qué tan comprometido(a) estás con transformar tu salud?',
      field: 'compromiso',
      options: [
        { label: 'Estoy listo(a) para hacer cambios importantes', value: 'Listo' },
        { label: 'Aún tengo dudas', value: 'Dudas' },
        { label: 'Solo estoy explorando opciones', value: 'Explorando' }
      ]
    },
    {
      title: 'Si tuvieras la certeza de que puedes revertir tu condición, ¿cuál presupuesto destinarías?',
      field: 'presupuesto',
      options: [
        { label: 'No podría invertir en este momento', value: 'NoPodría' },
        { label: '$1,000 - $2,500 USD', value: '$1-2.5k' },
        { label: '$2,501 - $5,000 USD', value: '$2.5-5k' },
        { label: '$5,001 - $10,000 USD', value: '$5-10k' },
        { label: 'Más de $10,000 USD', value: '>$10k' }
      ]
    }
  ];

  const currentStep = steps[step];
  const progress = Math.round((step / steps.length) * 100);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '640px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 500, marginBottom: '0.75rem', color: '#333' }}>
            Calcula tu pronóstico de reversión
          </h1>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>
            Responde este breve formulario y descubre qué tan cerca podrías estar de revertir tu resistencia a la insulina, prediabetes o diabetes tipo 2.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0, color: '#333' }}>
            {currentStep.title}
          </h2>
          <span style={{ fontSize: '13px', color: '#999' }}>
            {step + 1} de {steps.length}
          </span>
        </div>
        <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#378ADD', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {step === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChange={(e) => updateForm('nombre', e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            />
            <input
              type="email"
              placeholder="Tu correo"
              value={formData.correo}
              onChange={(e) => updateForm('correo', e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            />
            <input
              type="text"
              placeholder="Tu usuario de Instagram (sin @)"
              value={formData.instagram}
              onChange={(e) => updateForm('instagram', e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            />
            <input
              type="text"
              placeholder="País de residencia"
              value={formData.país}
              onChange={(e) => updateForm('país', e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentStep.options?.map((option) => (
              <label
                key={option.value}
                style={{
                  padding: '14px 16px',
                  border: formData[currentStep.field] === option.value ? '2px solid #378ADD' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: formData[currentStep.field] === option.value ? '#f0f8ff' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name={currentStep.field}
                  value={option.value}
                  checked={formData[currentStep.field] === option.value}
                  onChange={() => updateForm(currentStep.field, option.value)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: '#333', fontSize: '14px' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
        <button
          onClick={handlePrev}
          disabled={step === 0}
          style={{
            padding: '12px 24px',
            border: '1px solid #ddd',
            background: step === 0 ? '#f0f0f0' : 'white',
            color: '#333',
            borderRadius: '8px',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            opacity: step === 0 ? 0.5 : 1,
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          Atrás
        </button>
        <button
          onClick={handleNext}
          disabled={loading || (step === 0 && (!formData.nombre || !formData.correo)) || (step > 0 && !formData[currentStep?.field])}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: '#378ADD',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            opacity: (loading || (step === 0 && (!formData.nombre || !formData.correo)) || (step > 0 && !formData[currentStep?.field])) ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Procesando...' : step === steps.length - 1 ? 'Ver Resultado' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
