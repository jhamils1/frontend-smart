// Configuración de Stripe
// Claves de Stripe para pagos

export const STRIPE_CONFIG = {
  // Clave pública de Stripe (segura para usar en el frontend)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SCvbuR5wzazOaeQudU7h1g92cRPDFDMmd9jA1TMozTagr0iEZ67BYjvsfbvLmmZKLfMDwwTKrASBlY9FoXtvJt000cMR10Msc',
  
  // Opciones de configuración de Stripe
  options: {
    locale: 'es', // Idioma español
  },
};

// Métodos de pago disponibles
export const PAYMENT_METHODS = {
  TARJETA: 'tarjeta',
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
};

// Estados de pago
export const PAYMENT_STATUS = {
  PENDIENTE: 'pendiente',
  COMPLETADO: 'completado',
  FALLIDO: 'fallido',
  REEMBOLSADO: 'reembolsado',
};

// Configuración de moneda
export const CURRENCY_CONFIG = {
  code: 'BOB',
  symbol: 'Bs.',
  decimals: 2,
};

// Tarjetas de prueba para desarrollo
export const TEST_CARDS = {
  SUCCESS: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 25,
    cvc: '123',
  },
  DECLINE: {
    number: '4000000000000002',
    exp_month: 12,
    exp_year: 25,
    cvc: '123',
  },
  INSUFFICIENT_FUNDS: {
    number: '4000000000009995',
    exp_month: 12,
    exp_year: 25,
    cvc: '123',
  },
};
