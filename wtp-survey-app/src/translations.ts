import { Language } from './contexts/LanguageContext';

export const translations = {
  // Common
  common: {
    continue: {
      en: 'Continue',
      es: 'Continuar'
    },
    back: {
      en: 'Back',
      es: 'Atrás'
    },
    tokens: {
      en: 'Tokens',
      es: 'Tokens'
    },
    or: {
      en: 'or',
      es: 'o'
    }
  },

  // ParticipantIdScreen
  participantId: {
    title: {
      en: 'Welcome to the Survey',
      es: 'Bienvenido a la Encuesta'
    },
    description: {
      en: 'Please enter your participant ID to begin.',
      es: 'Por favor ingresa tu ID de participante para comenzar.'
    },
    label: {
      en: 'Participant ID',
      es: 'ID de Participante'
    },
    placeholder: {
      en: 'Enter your ID',
      es: 'Ingresa tu ID'
    }
  },

  // InstructionsScreen
  instructions: {
    title: {
      en: 'Survey Instructions',
      es: 'Instrucciones de la Encuesta'
    },
    paragraph1: {
      en: 'You are going to make some choices that will give you the chance to earn real rewards.',
      es: 'Vas a tomar algunas decisiones que te darán la oportunidad de ganar recompensas reales.'
    },
    paragraph2: {
      en: 'To get these rewards, you will receive tokens. These tokens have a value of',
      es: 'Para obtener estas recompensas, recibirás tokens. Estos tokens tienen un valor de'
    },
    paragraph2b: {
      en: ', and can be exchanged for a',
      es: ', y pueden ser canjeados por una'
    },
    paragraph2c: {
      en: 'whatever you want at the school shop',
      es: 'lo que quieras en la tienda escolar'
    },
    paragraph3: {
      en: 'Please pay attention to the comprehension checks on the next screen to ensure you understand how the survey works.',
      es: 'Por favor presta atención a las preguntas de comprensión en la siguiente pantalla para asegurarte de que entiendes cómo funciona la encuesta.'
    }
  },

  // ComprehensionCheckScreen
  comprehension: {
    title: {
      en: 'Comprehension Check',
      es: 'Verificación de Comprensión'
    },
    question1: {
      en: 'How much is 1 token worth in COP?',
      es: '¿Cuánto vale 1 token en COP?'
    },
    question2: {
      en: 'Where can you exchange your tokens to buy things?',
      es: '¿Dónde puedes canjear tus tokens para comprar cosas?'
    },
    placeholder1: {
      en: 'Enter amount',
      es: 'Ingresa la cantidad'
    },
    placeholder2: {
      en: 'Enter location',
      es: 'Ingresa el lugar'
    },
    error: {
      en: 'Incorrect. Please review the instructions.',
      es: 'Incorrecto. Por favor revisa las instrucciones.'
    }
  },

  // ReinstructionsScreen
  reinstructions: {
    title: {
      en: "Let's Review the Instructions",
      es: 'Repasemos las Instrucciones'
    },
    intro: {
      en: "Let's go over the key information again:",
      es: 'Repasemos la información clave nuevamente:'
    },
    tokenValueLabel: {
      en: 'Token Value:',
      es: 'Valor del Token:'
    },
    tokenValueText: {
      en: 'Each token is worth',
      es: 'Cada token vale'
    },
    rewardTypeLabel: {
      en: 'Reward Type:',
      es: 'Tipo de Recompensa:'
    },
    rewardTypeText: {
      en: 'You can exchange your tokens at the school shop to buy whatever you want.',
      es: 'Puedes canjear tus tokens en la tienda escolar para comprar lo que quieras.'
    },
    outro: {
      en: "Please review these details carefully. You'll have another chance to answer the comprehension questions.",
      es: 'Por favor revisa estos detalles cuidadosamente. Tendrás otra oportunidad para responder las preguntas de comprensión.'
    },
    button: {
      en: 'Continue to Comprehension Check',
      es: 'Continuar a la Verificación de Comprensión'
    }
  },

  // TokenAllocationScreen
  tokenAllocation: {
    title: {
      en: 'Your Starting Tokens',
      es: 'Tus Tokens Iniciales'
    },
    description1: {
      en: 'You have been given',
      es: 'Se te han dado'
    },
    description2: {
      en: 'tokens',
      es: 'tokens'
    },
    worth: {
      en: 'Worth',
      es: 'Equivalente a'
    },
    info: {
      en: 'Your token balance is displayed in the top right corner. It will update throughout the survey as you make your choices. Whatever you have left at the end you can reimburse.',
      es: 'Tu saldo de tokens se muestra en la esquina superior derecha. Se actualizará durante la encuesta a medida que tomes tus decisiones. Lo que te quede al final podrás cobrarlo.'
    }
  },

  // ChoiceInstructionsScreen1
  choiceInstructions1: {
    title: {
      en: 'About Your Choices',
      es: 'Acerca de tus Decisiones'
    },
    paragraph1: {
      en: 'The choices you will make will involve limiting certain apps to 30 minutes per day on your phone.',
      es: 'Las decisiones que tomarás implicarán limitar ciertas aplicaciones a 30 minutos por día en tu teléfono.'
    },
    paragraph2: {
      en: 'If you choose to set a limit, and that option is chosen, then our team will actually limit the app to 30 minutes per day on your phone for one week later today, and set a password so you cannot change it.',
      es: 'Si eliges establecer un límite, y esa opción es seleccionada, entonces nuestro equipo realmente limitará la aplicación a 30 minutos por día en tu teléfono por una semana más tarde hoy, y pondrá una contraseña para que no puedas cambiarlo.'
    },
    paragraph3: {
      en: 'So you should only select the options that you really prefer.',
      es: 'Por lo tanto, solo debes seleccionar las opciones que realmente prefieres.'
    }
  },

  // ChoiceInstructionsScreen2
  choiceInstructions2: {
    important: {
      en: 'Important:',
      es: 'Importante:'
    },
    paragraph1: {
      en: 'You will make multiple choices, and only one of your choices will randomly be selected to be implemented.',
      es: 'Harás múltiples decisiones, y solo una de tus decisiones será seleccionada al azar para ser implementada.'
    },
    paragraph2: {
      en: 'This means that each question should be treated independently, and for every choice, you should give your honest answer.',
      es: 'Esto significa que cada pregunta debe ser tratada independientemente, y para cada decisión, debes dar tu respuesta honesta.'
    },
    button: {
      en: 'Begin Choices',
      es: 'Comenzar Decisiones'
    }
  },

  // AppIntroductionScreen
  appIntroduction: {
    title: {
      en: 'App Limiting Questions:',
      es: 'Preguntas sobre Limitar Aplicación:'
    },
    description: {
      en: "We're now going to ask you some questions to see how willing you would be to limit",
      es: 'Ahora te haremos algunas preguntas para ver qué tan dispuesto estarías a limitar'
    },
    description2: {
      en: 'to 30 minutes per day for 1 week on your phone.',
      es: 'a 30 minutos por día por 1 semana en tu teléfono.'
    }
  },

  // ChoiceQuestionScreen
  choiceQuestion: {
    questionOf: {
      en: 'Question',
      es: 'Pregunta'
    },
    of: {
      en: 'of',
      es: 'de'
    },
    wouldYouRather: {
      en: 'Would you rather...',
      es: 'Preferirías...'
    },
    receive: {
      en: 'RECEIVE',
      es: 'RECIBIR'
    },
    pay: {
      en: 'PAY',
      es: 'PAGAR'
    },
    tokens: {
      en: 'tokens',
      es: 'tokens'
    },
    worth: {
      en: 'worth',
      es: 'equivalente a'
    },
    limit: {
      en: 'Limit',
      es: 'Limitar'
    },
    limitDescription: {
      en: 'to 30 min/day for 1 week',
      es: 'a 30 min/día por 1 semana'
    },
    andNotLimit: {
      en: 'AND NOT limit',
      es: 'Y NO limitar'
    },
    butNotLimit: {
      en: 'BUT NOT limit',
      es: 'PERO NO limitar'
    },
    doNotLimit: {
      en: 'DO NOT limit',
      es: 'NO limitar'
    },
    maintainTokens: {
      en: 'and maintain token balance',
      es: 'y mantener el saldo de tokens'
    }
  },

  // ChoiceComprehensionCheckScreen
  choiceComprehensionCheck: {
    title: {
      en: 'Comprehension Check',
      es: 'Verificación de Comprensión'
    },
    confirmTokens: {
      en: 'To confirm, you would prefer to {action} {tokens} tokens {connector} NOT limit {app}, so that you would end up with {finalBalance} tokens at the end of the experiment?',
      es: 'Para confirmar, ¿preferirías {action} {tokens} tokens {connector} NO limitar {app}, para que termines con {finalBalance} tokens al final del experimento?'
    },
    confirmTokensZero: {
      en: 'To confirm, you would prefer to NOT limit {app} and maintain your token balance at {currentBalance} tokens at the end of the experiment?',
      es: 'Para confirmar, ¿preferirías NO limitar {app} y mantener tu saldo de tokens en {currentBalance} tokens al final del experimento?'
    },
    confirmLimit: {
      en: 'To confirm, you would prefer to limit {app} to 30 minutes per day for a week, rather than {action} {tokens} tokens, so your token balance would remain at {currentBalance} tokens at the end of the experiment?',
      es: 'Para confirmar, ¿preferirías limitar {app} a 30 minutos por día por una semana, en lugar de {action} {tokens} tokens, por lo que tu saldo de tokens permanecería en {currentBalance} tokens al final del experimento?'
    },
    receive: {
      en: 'receive',
      es: 'recibir'
    },
    pay: {
      en: 'pay',
      es: 'pagar'
    },
    receiving: {
      en: 'receiving',
      es: 'recibir'
    },
    paying: {
      en: 'paying',
      es: 'pagar'
    },
    and: {
      en: 'AND',
      es: 'Y'
    },
    but: {
      en: 'BUT',
      es: 'PERO'
    },
    yes: {
      en: 'I confirm',
      es: 'Confirmo'
    },
    no: {
      en: 'Go back',
      es: 'Volver'
    }
  },

  // ChoicesSummaryScreen
  choicesSummary: {
    title: {
      en: 'Your Choices',
      es: 'Tus Decisiones'
    },
    selecting: {
      en: 'Randomly selecting one of your choices...',
      es: 'Seleccionando aleatoriamente una de tus decisiones...'
    },
    instruction: {
      en: 'Here are all the choices you made. Click below to randomly select one to implement.',
      es: 'Aquí están todas las decisiones que tomaste. Haz clic abajo para seleccionar aleatoriamente una para implementar.'
    },
    selectButton: {
      en: 'Randomly Select One Choice',
      es: 'Seleccionar Aleatoriamente una Decisión'
    },
    selectingLabel: {
      en: 'Selecting...',
      es: 'Seleccionando...'
    },
    selectedMessage: {
      en: 'has been selected!',
      es: 'ha sido seleccionada!'
    },
    selectedDescription: {
      en: 'This is the choice that will be implemented.',
      es: 'Esta es la decisión que será implementada.'
    },
    continueToResults: {
      en: 'Continue to Results',
      es: 'Continuar a Resultados'
    },
    receive: {
      en: 'Receive',
      es: 'Recibir'
    },
    pay: {
      en: 'Pay',
      es: 'Pagar'
    },
    tokens: {
      en: 'tokens',
      es: 'tokens'
    },
    limit: {
      en: 'Limit',
      es: 'Limitar'
    },
    limitDuration: {
      en: 'to 30 min/day for 1 week',
      es: 'a 30 min/día por 1 semana'
    },
    choice: {
      en: 'Choice #',
      es: 'Decisión #'
    }
  },

  // ResultsScreen
  results: {
    title: {
      en: 'Implementation Results',
      es: 'Resultados de Implementación'
    },
    whatWillHappen: {
      en: 'What will happen:',
      es: 'Qué sucederá:'
    },
    limitMessage1: {
      en: 'will be limited to 30 minutes per day on your phone for',
      es: 'será limitada a 30 minutos por día en tu teléfono por'
    },
    limitMessage2: {
      en: '1 week',
      es: '1 semana'
    },
    limitMessage3: {
      en: 'starting today.',
      es: 'comenzando hoy.'
    },
    limitMessage4: {
      en: 'Our team will set the limit with a password so you cannot change it.',
      es: 'Nuestro equipo establecerá el límite con una contraseña para que no puedas cambiarlo.'
    },
    tokenMessage1: {
      en: 'You will',
      es: 'Tú'
    },
    receive: {
      en: 'receive',
      es: 'recibirás'
    },
    pay: {
      en: 'pay',
      es: 'pagarás'
    },
    tokens: {
      en: 'tokens',
      es: 'tokens'
    },
    thisIsWorth: {
      en: 'This is worth',
      es: 'Esto equivale a'
    },
    willNotBeLimited: {
      en: 'will not be limited.',
      es: 'no será limitada.'
    },
    finalTokenBalance: {
      en: 'Final Token Balance:',
      es: 'Saldo Final de Tokens:'
    },
    finishSurvey: {
      en: 'Finish Survey',
      es: 'Finalizar Encuesta'
    }
  },

  // ThankYouScreen
  thankYou: {
    title: {
      en: 'Thank You!',
      es: '¡Gracias!'
    },
    completed: {
      en: 'You have completed the survey.',
      es: 'Has completado la encuesta.'
    },
    recorded: {
      en: 'Your responses have been recorded.',
      es: 'Tus respuestas han sido registradas.'
    },
    contactInfo: {
      en: 'Our team will contact you about implementing your selected choice (app limit or tokens) and redeeming your tokens at the school shop.',
      es: 'Nuestro equipo te contactará sobre la implementación de tu decisión seleccionada (límite de aplicación o tokens) y el canje de tus tokens en la tienda escolar.'
    },
    participantId: {
      en: 'Participant ID:',
      es: 'ID de Participante:'
    },
    downloadData: {
      en: 'Download Survey Data (for testing)',
      es: 'Descargar Datos de la Encuesta (para pruebas)'
    },
    startNew: {
      en: 'Start New Survey',
      es: 'Iniciar Nueva Encuesta'
    }
  },

  // TokenCounter
  tokenCounter: {
    tokens: {
      en: 'Tokens',
      es: 'Tokens'
    }
  },

  // VersionInfo
  versionInfo: {
    refreshTitle: {
      en: 'Force refresh and clear cache',
      es: 'Forzar actualización y limpiar caché'
    },
    refreshLabel: {
      en: 'Force refresh',
      es: 'Forzar actualización'
    }
  }
};

export const t = (key: string, lang: Language): string => {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }

  return value[lang] || value['en'] || key;
};
