import React, { useState } from 'react';
import { SurveyProvider, useSurvey } from './contexts/SurveyContext';
import { ParticipantIdScreen } from './screens/ParticipantIdScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { ComprehensionCheckScreen } from './screens/ComprehensionCheckScreen';
import { TokenAllocationScreen } from './screens/TokenAllocationScreen';
import { ChoiceInstructionsScreen } from './screens/ChoiceInstructionsScreen';
import { ChoiceQuestionScreen } from './screens/ChoiceQuestionScreen';
import { RandomSelectionScreen } from './screens/RandomSelectionScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ThankYouScreen } from './screens/ThankYouScreen';
import { TOKEN_AMOUNTS } from './types/survey';

type Screen =
  | 'participantId'
  | 'instructions'
  | 'comprehension'
  | 'tokenAllocation'
  | 'choiceInstructions'
  | 'choices'
  | 'randomSelection'
  | 'results'
  | 'thankYou';

const SurveyFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('participantId');
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const { surveyData } = useSurvey();

  // Generate all choice questions based on randomized app order
  const allChoices = surveyData.appOrder.flatMap((app) =>
    TOKEN_AMOUNTS.map((tokenAmount) => ({ app, tokenAmount }))
  );

  const goToNextScreen = () => {
    switch (currentScreen) {
      case 'participantId':
        setCurrentScreen('instructions');
        break;
      case 'instructions':
        setCurrentScreen('comprehension');
        break;
      case 'comprehension':
        setCurrentScreen('tokenAllocation');
        break;
      case 'tokenAllocation':
        setCurrentScreen('choiceInstructions');
        break;
      case 'choiceInstructions':
        setCurrentScreen('choices');
        setCurrentChoiceIndex(0);
        break;
      case 'choices':
        if (currentChoiceIndex < allChoices.length - 1) {
          setCurrentChoiceIndex(currentChoiceIndex + 1);
        } else {
          setCurrentScreen('randomSelection');
        }
        break;
      case 'randomSelection':
        setCurrentScreen('results');
        break;
      case 'results':
        setCurrentScreen('thankYou');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {currentScreen === 'participantId' && (
        <ParticipantIdScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'instructions' && (
        <InstructionsScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'comprehension' && (
        <ComprehensionCheckScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'tokenAllocation' && (
        <TokenAllocationScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'choiceInstructions' && (
        <ChoiceInstructionsScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'choices' && (
        <ChoiceQuestionScreen
          app={allChoices[currentChoiceIndex].app}
          tokenAmount={allChoices[currentChoiceIndex].tokenAmount}
          questionNumber={currentChoiceIndex + 1}
          totalQuestions={allChoices.length}
          onNext={goToNextScreen}
        />
      )}
      {currentScreen === 'randomSelection' && (
        <RandomSelectionScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'thankYou' && <ThankYouScreen />}
    </>
  );
};

function App() {
  return (
    <SurveyProvider>
      <SurveyFlow />
    </SurveyProvider>
  );
}

export default App;
