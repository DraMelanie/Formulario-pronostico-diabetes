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
          etiqueta: 'Prospecto_Formulario_VSL',
          siguientePaso: 'Iniciar un proceso de reversión'
        };
      } else {
        return {
          categoría: '🔥 ALTO PRONÓSTICO DE REVERSIÓN',
          score: score,
          mensaje: 'Tienes excelentes características para revertir tu condición.',
          detalles: 'Tu perfil metabólico muestra una alta probabilidad de responder a cambios de manera inmediata. Hemos preparado recursos gratuitos para que comiences tu transformación hoy mismo.',
          acción: 'free',
          etiqueta: 'Prospecto_Formulario_free',
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
          etiqueta: 'Prospecto_Formulario_VSL',
          siguientePaso: 'Iniciar un proceso de reversión'
        };
      } else {
        return {
          categoría: '⚠️ PRONÓSTICO INTERMEDIO DE REVERSIÓN',
          score: score,
          mensaje: 'Puedes lograr mejoras significativas con acompañamiento especializado.',
          detalles: 'Muchas personas en tu rango logran cambios positivos. Comienza con nuestro ebook gratuito y training exclusivo para aprender la metodología que uso con mis pacientes.',
          acción: 'free',
          etiqueta: 'Prospecto_Formulario_free',
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
        correo: formData.correo,
        nombre: formData.nombre,
        instagram: formData.instagram,
        país: formData.país,
        edad: formData.edad,
        diagnóstico: formData.diagnóstico,
        score: segmento.score,
        categoría: segmento.categoría,
        emoción: formData.emoción,
        presupuesto: formData.presupuesto,
        etiqueta: segmento.etiqueta
      };

      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      <div style={{ padding: '2rem 1.5rem', maxWidth: '640px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '0.75rem', color: '#333', lineHeight: 1.3 }}>
            Tu Pronóstico
          </h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
            Análisis completado y guardado en nuestro sistema
          </p>
        </div>

        <div style={{
          background: resultado.acción === 'vsl' || resultado.acción === 'free' ? 'rgba(61, 109, 63, 0.08)' : 'rgba(216, 90, 48, 0.08)',
          border: resultado.acción === 'vsl' || resultado.acción === 'free' ? '2px solid #3d6d3f' : '2px solid #D85A30',
          borderRadius: '16px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '64px', fontWeight: 600, marginBottom: '1rem', color: '#333' }}>
            {resultado.score}
            <span style={{ fontSize: '28px', color: '#999', marginLeft: '0.5rem' }}>/18</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '1.5rem', color: '#333', margin: 0, marginTop: '1rem', lineHeight: 1.3 }}>
            {resultado.categoría}
          </h2>
          <p style={{ color: '#333', fontSize: '16px', lineHeight: 1.7, margin: '1rem 0 0 0', fontWeight: 500 }}>
            {resultado.mensaje}
          </p>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, margin: '1rem 0 0 0' }}>
            {resultado.detalles}
          </p>
        </div>

        <div style={{ background: '#f8f8f8', padding: '1.75rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <p style={{ color: '#666', fontSize: '12px', fontWeight: 600, margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tu próximo paso
          </p>
          <p style={{ color: '#333', fontSize: '17px', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
            {resultado.siguientePaso}
          </p>
        </div>

        {resultado.acción === 'vsl' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="https://www.somosplantpowered.com/vsl-piad" style={{
              display: 'block',
              background: '#3d6d3f',
              color: 'white',
              padding: '18px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '16px',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }} onMouseOver={(e) => e.target.style.background = '#2d5a30'} onMouseOut={(e) => e.target.style.background = '#3d6d3f'}>
              Ver Metodología de Reversión →
            </a>
            <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Recibirás un email con todos los detalles
            </p>
          </div>
        )}

        {resultado.acción === 'free' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              background: '#3d6d3f',
              color: 'white',
              padding: '18px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '16px',
              transition: 'all 0.3s'
            }} onMouseOver={(e) => e.target.style.background = '#2d5a30'} onMouseOut={(e) => e.target.style.background = '#3d6d3f'}>
              Descargar Ebook Gratuito →
            </button>
            <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              + Acceso al training "Domina tu Glucosa" (10 días)
            </p>
          </div>
        )}

        {resultado.acción === 'medical' && (
          <div style={{ background: 'rgba(216, 90, 48, 0.08)', border: '2px solid #D85A30', padding: '1.75rem', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ color: '#333', fontSize: '16px', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
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
    <div style={{ 
      padding: '1.5rem', 
      maxWidth: '640px', 
      margin: '0 auto', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '2.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '1rem' }}>
          <img 
            src="https://i.imgur.com/JQFiMig.png" 
            alt="Somos Plant Powered" 
            style={{ height: '60px', objectFit: 'contain', marginBottom: '1.5rem' }}
          />
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '1rem', color: '#333', lineHeight: 1.3 }}>
            Calcula tu pronóstico de reversión
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, margin: 0 }}>
            Responde este breve formulario y descubre qué tan cerca podrías estar de revertir tu resistencia a la insulina, prediabetes o diabetes tipo 2.
          </p>
        </div>

        {/* Step Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#333', flex: 1, lineHeight: 1.3 }}>
            {currentStep.title}
          </h2>
          <span style={{ fontSize: '14px', color: '#999', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
            {step + 1}/{steps.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ 
            height: '100%', 
            background: '#3d6d3f', 
            width: `${progress}%`, 
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Form Content */}
      <div style={{ marginBottom: '2rem' }}>
        {step === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChange={(e) => updateForm('nombre', e.target.value)}
              style={{ 
                padding: '16px 14px', 
                borderRadius: '10px', 
                border: '2px solid #ddd', 
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <input
              type="email"
              placeholder="Tu correo"
              value={formData.correo}
              onChange={(e) => updateForm('correo', e.target.value)}
              style={{ 
                padding: '16px 14px', 
                borderRadius: '10px', 
                border: '2px solid #ddd', 
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <input
              type="text"
              placeholder="Tu usuario de Instagram (sin @)"
              value={formData.instagram}
              onChange={(e) => updateForm('instagram', e.target.value)}
              style={{ 
                padding: '16px 14px', 
                borderRadius: '10px', 
                border: '2px solid #ddd', 
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <input
              type="text"
              placeholder="País de residencia"
              value={formData.país}
              onChange={(e) => updateForm('país', e.target.value)}
              style={{ 
                padding: '16px 14px', 
                borderRadius: '10px', 
                border: '2px solid #ddd', 
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d6d3f'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentStep.options?.map((option) => (
              <label
                key={option.value}
                style={{
                  padding: '16px 16px',
                  border: formData[currentStep.field] === option.value ? '2px solid #3d6d3f' : '2px solid #e0e0e0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  background: formData[currentStep.field] === option.value ? 'rgba(61, 109, 63, 0.05)' : '#ffffff',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name={currentStep.field}
                  value={option.value}
                  checked={formData[currentStep.field] === option.value}
                  onChange={() => updateForm(currentStep.field, option.value)}
                  style={{ cursor: 'pointer', marginTop: '4px', width: '20px', height: '20px' }}
                />
                <span style={{ color: '#333', fontSize: '16px', fontWeight: 500, lineHeight: 1.4 }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
        <button
          onClick={handlePrev}
          disabled={step === 0}
          style={{
            padding: '16px 20px',
            border: '2px solid #ddd',
            background: step === 0 ? '#f5f5f5' : '#ffffff',
            color: '#333',
            borderRadius: '10px',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            opacity: step === 0 ? 0.5 : 1,
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.2s',
            flex: 1
          }}
          onMouseOver={(e) => !step === 0 && (e.target.style.background = '#f8f8f8')}
          onMouseOut={(e) => e.target.style.background = step === 0 ? '#f5f5f5' : '#ffffff'}
        >
          Atrás
        </button>
        <button
          onClick={handleNext}
          disabled={loading || (step === 0 && (!formData.nombre || !formData.correo)) || (step > 0 && !formData[currentStep?.field])}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: '#3d6d3f',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            opacity: (loading || (step === 0 && (!formData.nombre || !formData.correo)) || (step > 0 && !formData[currentStep?.field])) ? 0.6 : 1,
            transition: 'all 0.2s',
            flex: 1
          }}
          onMouseOver={(e) => !loading && (e.target.style.background = '#2d5a30')}
          onMouseOut={(e) => e.target.style.background = '#3d6d3f'}
        >
          {loading ? 'Procesando...' : step === steps.length - 1 ? 'Ver Resultado' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
