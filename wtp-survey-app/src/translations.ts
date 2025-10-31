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
      en: ', and can be exchanged for',
      es: ', y pueden ser canjeados por'
    },
    paragraph2c: {
      en: 'the gifts brought by the surveyors',
      es: 'los regalos que trajeron los encuestadores'
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
      en: 'You can exchange your tokens for the gifts brought by the surveyors.',
      es: 'Puedes canjear tus tokens por los regalos que trajeron los encuestadores.'
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
      en: 'Our team will contact you about implementing your selected choice (app limit or tokens) and redeeming your tokens for the gifts.',
      es: 'Nuestro equipo te contactará sobre la implementación de tu decisión seleccionada (límite de aplicación o tokens) y el canje de tus tokens por los regalos.'
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
  },

  // SwitchingPointConfirmationScreen
  switchingPoint: {
    title: {
      en: 'Please Confirm Your Choice',
      es: 'Por Favor Confirma tu Decisión'
    },
    yourChoice: {
      en: 'Your Choice:',
      es: 'Tu Decisión:'
    },
    whatThisMeans: {
      en: 'What This Means:',
      es: 'Qué Significa Esto:'
    },
    choseLimitOverReceive: {
      en: 'You chose to limit {app} rather than receive {tokenAmount} tokens (worth {value} COP).',
      es: 'Elegiste limitar {app} en lugar de recibir {tokenAmount} tokens (equivalente a {value} COP).'
    },
    // Simplified explanations for "willing to pay" direction
    simplifiedPayExplanation: {
      en: 'Since you were willing to pay {tokenAmount} tokens to avoid limiting {app}, we assume you would also be willing to pay less.',
      es: 'Dado que estuviste dispuesto a pagar {tokenAmount} tokens para evitar limitar {app}, asumimos que también estarías dispuesto a pagar menos.'
    },
    // Simplified explanations for "willing to limit" direction
    simplifiedLimitExplanation: {
      en: 'Since you chose to limit {app} rather than pay {tokenAmount} tokens, we assume you would also choose to limit it rather than pay more.',
      es: 'Dado que elegiste limitar {app} en lugar de pagar {tokenAmount} tokens, asumimos que también elegirías limitarla en lugar de pagar más.'
    },
    // Keep old translations for edge cases with zero or receiving tokens
    choseLimitOverZero: {
      en: 'Since you chose to limit {app} rather than keep your tokens unchanged, we assume you would also choose to limit it even if you had to pay.',
      es: 'Dado que elegiste limitar {app} en lugar de mantener tus tokens sin cambios, asumimos que también elegirías limitarla incluso si tuvieras que pagar.'
    },
    choseZeroOverLimit: {
      en: 'Since you chose to keep your tokens rather than limit {app}, we assume you would also be willing to pay to avoid limiting.',
      es: 'Dado que elegiste mantener tus tokens en lugar de limitar {app}, asumimos que también estarías dispuesto a pagar para evitar limitar.'
    },
    simplifiedReceiveExplanation: {
      en: 'Since you chose to receive {tokenAmount} tokens rather than limit {app}, we assume you would also choose to receive less, or even pay to avoid limiting.',
      es: 'Dado que elegiste recibir {tokenAmount} tokens en lugar de limitar {app}, asumimos que también elegirías recibir menos, o incluso pagar para evitar limitar.'
    },
    simplifiedLimitOverReceiveExplanation: {
      en: 'Since you chose to limit {app} rather than receive {tokenAmount} tokens, we assume you would also choose to limit it for smaller amounts or even if you had to pay.',
      es: 'Dado que elegiste limitar {app} en lugar de recibir {tokenAmount} tokens, asumimos que también elegirías limitarla por cantidades menores o incluso si tuvieras que pagar.'
    },
    autoFillNotice: {
      en: 'We will automatically fill in the remaining {count} questions for {app} based on your choice.',
      es: 'Automáticamente completaremos las {count} preguntas restantes para {app} según tu decisión.'
    },
    confirmQuestion: {
      en: 'Is this understanding correct?',
      es: '¿Es correcta esta interpretación?'
    },
    goBack: {
      en: 'No, Go Back',
      es: 'No, Volver'
    },
    confirm: {
      en: 'Yes, Continue',
      es: 'Sí, Continuar'
    }
  },

  // AutoFilledExplanationScreen
  autoFilled: {
    title: {
      en: 'Questions Completed for {app}',
      es: 'Preguntas Completadas para {app}'
    },
    explanation: {
      en: 'Based on your previous choice, we have automatically filled {count} remaining questions for {app}.',
      es: 'Según tu decisión anterior, hemos completado automáticamente {count} preguntas restantes para {app}.'
    },
    filledAnswers: {
      en: 'Automatically Filled Answers:',
      es: 'Respuestas Completadas Automáticamente:'
    },
    question: {
      en: 'Question',
      es: 'Pregunta'
    },
    decision: {
      en: 'Choice',
      es: 'Decisión'
    },
    canGoBack: {
      en: 'If you want to change your answer, you can go back to modify your choice.',
      es: 'Si quieres cambiar tu respuesta, puedes volver atrás para modificar tu decisión.'
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
