import React, { useState } from 'react';
import { SurveyProvider, useSurvey } from './contexts/SurveyContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ParticipantIdScreen } from './screens/ParticipantIdScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { ComprehensionCheckScreen } from './screens/ComprehensionCheckScreen';
import { ReinstructionsScreen } from './screens/ReinstructionsScreen';
import { TokenAllocationScreen } from './screens/TokenAllocationScreen';
import { ChoiceInstructionsScreen1 } from './screens/ChoiceInstructionsScreen1';
import { ChoiceInstructionsScreen2 } from './screens/ChoiceInstructionsScreen2';
import { AppIntroductionScreen } from './screens/AppIntroductionScreen';
import { ChoiceQuestionScreen } from './screens/ChoiceQuestionScreen';
import { ChoicesSummaryScreen } from './screens/ChoicesSummaryScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ThankYouScreen } from './screens/ThankYouScreen';
import { TOKEN_AMOUNTS } from './types/survey';
import { VersionInfo } from './components/VersionInfo';
import { LanguageToggle } from './components/LanguageToggle';

type Screen =
  | 'participantId'
  | 'instructions'
  | 'comprehension'
  | 'reinstructions'
  | 'tokenAllocation'
  | 'choiceInstructions1'
  | 'choiceInstructions2'
  | 'appIntroduction1'
  | 'appIntroduction2'
  | 'choices'
  | 'choicesSummary'
  | 'results'
  | 'thankYou';

const SurveyFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('participantId');
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const { surveyData } = useSurvey();

  // Generate all choice questions based on randomized app order and token order
  const orderedTokenAmounts = surveyData.tokenOrder === 'ascending'
    ? [...TOKEN_AMOUNTS].reverse()
    : TOKEN_AMOUNTS;

  const allChoices = surveyData.appOrder.flatMap((app) =>
    orderedTokenAmounts.map((tokenAmount) => ({ app, tokenAmount }))
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
      case 'reinstructions':
        setCurrentScreen('comprehension');
        break;
      case 'tokenAllocation':
        setCurrentScreen('choiceInstructions1');
        break;
      case 'choiceInstructions1':
        setCurrentScreen('choiceInstructions2');
        break;
      case 'choiceInstructions2':
        setCurrentScreen('appIntroduction1');
        break;
      case 'appIntroduction1':
        setCurrentScreen('choices');
        setCurrentChoiceIndex(0);
        break;
      case 'appIntroduction2':
        setCurrentScreen('choices');
        setCurrentChoiceIndex(8);
        break;
      case 'choices':
        if (currentChoiceIndex === 7) {
          // After first 8 questions, show second app introduction
          setCurrentScreen('appIntroduction2');
        } else if (currentChoiceIndex < allChoices.length - 1) {
          setCurrentChoiceIndex(currentChoiceIndex + 1);
        } else {
          setCurrentScreen('choicesSummary');
        }
        break;
      case 'choicesSummary':
        setCurrentScreen('results');
        break;
      case 'results':
        setCurrentScreen('thankYou');
        break;
      default:
        break;
    }
  };

  const handleComprehensionFailed = () => {
    setCurrentScreen('reinstructions');
  };

  const goToPreviousScreen = () => {
    switch (currentScreen) {
      case 'instructions':
        setCurrentScreen('participantId');
        break;
      case 'comprehension':
        setCurrentScreen('instructions');
        break;
      case 'tokenAllocation':
        setCurrentScreen('comprehension');
        break;
      case 'choiceInstructions1':
        setCurrentScreen('tokenAllocation');
        break;
      case 'choiceInstructions2':
        setCurrentScreen('choiceInstructions1');
        break;
      case 'appIntroduction1':
        setCurrentScreen('choiceInstructions2');
        break;
      case 'appIntroduction2':
        setCurrentScreen('choices');
        setCurrentChoiceIndex(7);
        break;
      case 'choices':
        if (currentChoiceIndex === 8) {
          // Going back from first question of second app batch
          setCurrentScreen('appIntroduction2');
        } else if (currentChoiceIndex > 0) {
          setCurrentChoiceIndex(currentChoiceIndex - 1);
        } else {
          setCurrentScreen('appIntroduction1');
        }
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
        <InstructionsScreen onNext={goToNextScreen} onBack={goToPreviousScreen} />
      )}
      {currentScreen === 'comprehension' && (
        <ComprehensionCheckScreen
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
          onFailed={handleComprehensionFailed}
        />
      )}
      {currentScreen === 'reinstructions' && (
        <ReinstructionsScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'tokenAllocation' && (
        <TokenAllocationScreen onNext={goToNextScreen} onBack={goToPreviousScreen} />
      )}
      {currentScreen === 'choiceInstructions1' && (
        <ChoiceInstructionsScreen1 onNext={goToNextScreen} onBack={goToPreviousScreen} />
      )}
      {currentScreen === 'choiceInstructions2' && (
        <ChoiceInstructionsScreen2 onNext={goToNextScreen} onBack={goToPreviousScreen} />
      )}
      {currentScreen === 'appIntroduction1' && (
        <AppIntroductionScreen
          app={surveyData.appOrder[0]}
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'appIntroduction2' && (
        <AppIntroductionScreen
          app={surveyData.appOrder[1]}
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'choices' && (
        <ChoiceQuestionScreen
          app={allChoices[currentChoiceIndex].app}
          tokenAmount={allChoices[currentChoiceIndex].tokenAmount}
          questionNumber={currentChoiceIndex + 1}
          totalQuestions={allChoices.length}
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'choicesSummary' && (
        <ChoicesSummaryScreen onNext={goToNextScreen} />
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
    <LanguageProvider>
      <SurveyProvider>
        <SurveyFlow />
        <LanguageToggle />
        <VersionInfo />
      </SurveyProvider>
    </LanguageProvider>
  );
}

export default App;
