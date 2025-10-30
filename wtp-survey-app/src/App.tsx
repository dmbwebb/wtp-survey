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
import { ChoiceComprehensionCheckScreen } from './screens/ChoiceComprehensionCheckScreen';
import { SwitchingPointConfirmationScreen } from './screens/SwitchingPointConfirmationScreen';
import { AutoFilledExplanationScreen } from './screens/AutoFilledExplanationScreen';
import { ChoicesSummaryScreen } from './screens/ChoicesSummaryScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ThankYouScreen } from './screens/ThankYouScreen';
import { TOKEN_AMOUNTS } from './types/survey';
import { LanguageToggle } from './components/LanguageToggle';
import { SurveyFooter } from './components/SurveyFooter';

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
  | 'choiceComprehension'
  | 'switchingPointConfirmation'
  | 'autoFilledExplanation'
  | 'choicesSummary'
  | 'results'
  | 'thankYou';

const SurveyFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('currentScreen');
    return (saved as Screen) || 'participantId';
  });
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(() => {
    const saved = localStorage.getItem('currentChoiceIndex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const { surveyData, autoFillChoices, hasSwitchingPoint, clearAutoFilledChoices, removeChoice, resetSurvey } = useSurvey();

  // Persist screen position to localStorage
  React.useEffect(() => {
    localStorage.setItem('currentScreen', currentScreen);
  }, [currentScreen]);

  // Persist choice index to localStorage
  React.useEffect(() => {
    localStorage.setItem('currentChoiceIndex', currentChoiceIndex.toString());
  }, [currentChoiceIndex]);

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
        setCurrentChoiceIndex(6);
        break;
      case 'choices': {
        // Get the current app from the current choice
        const currentApp = allChoices[currentChoiceIndex].app;

        // Check if we just confirmed a switching point and should skip remaining questions
        if (hasSwitchingPoint(currentApp)) {
          // Find the next question that's for a different app or end of choices
          let nextIndex = currentChoiceIndex + 1;
          while (nextIndex < allChoices.length && allChoices[nextIndex].app === currentApp) {
            nextIndex++;
          }

          // If we're still on questions for the same app, show auto-filled explanation
          if (nextIndex > currentChoiceIndex + 1) {
            setCurrentScreen('autoFilledExplanation');
            setCurrentChoiceIndex(nextIndex);
            break;
          }
        }

        // Normal progression logic
        if (currentChoiceIndex === 0) {
          // After first question, show choice comprehension check
          setCurrentScreen('choiceComprehension');
        } else if (currentChoiceIndex === 5) {
          // After first 6 questions, show second app introduction
          setCurrentScreen('appIntroduction2');
        } else if (currentChoiceIndex < allChoices.length - 1) {
          setCurrentChoiceIndex(currentChoiceIndex + 1);
        } else {
          setCurrentScreen('choicesSummary');
        }
        break;
      }
      case 'choiceComprehension':
        // After confirming first choice, continue to second question
        setCurrentChoiceIndex(1);
        setCurrentScreen('choices');
        break;
      case 'switchingPointConfirmation': {
        // Confirm the switching point and auto-fill choices
        const currentApp = allChoices[currentChoiceIndex].app;
        autoFillChoices(currentApp);

        // Find the next question that's for a different app or end of choices
        let nextIndex = currentChoiceIndex + 1;
        while (nextIndex < allChoices.length && allChoices[nextIndex].app === currentApp) {
          nextIndex++;
        }
        setCurrentChoiceIndex(nextIndex);

        // Show auto-filled explanation
        setCurrentScreen('autoFilledExplanation');
        break;
      }
      case 'autoFilledExplanation': {
        // After seeing auto-filled explanation, move to next app or summary
        // currentChoiceIndex should already be set to the next question for different app
        if (currentChoiceIndex === 6) {
          // Moving to second app
          setCurrentScreen('appIntroduction2');
        } else if (currentChoiceIndex < allChoices.length) {
          setCurrentScreen('choices');
        } else {
          setCurrentScreen('choicesSummary');
        }
        break;
      }
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

  const handleSwitchingPointDetected = () => {
    setCurrentScreen('switchingPointConfirmation');
  };

  const handleStartNewSurvey = async () => {
    // Reset survey data (generates new ID, clears all data)
    await resetSurvey();

    // Clear screen position from localStorage
    localStorage.removeItem('currentScreen');
    localStorage.removeItem('currentChoiceIndex');

    // Reset screen state
    setCurrentScreen('participantId');
    setCurrentChoiceIndex(0);
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
        setCurrentChoiceIndex(5);
        break;
      case 'choiceComprehension':
        // Going back from choice comprehension to first question
        setCurrentChoiceIndex(0);
        setCurrentScreen('choices');
        break;
      case 'switchingPointConfirmation': {
        // Going back from switching point confirmation - clear the unconfirmed switching point
        const currentApp = allChoices[currentChoiceIndex].app;
        const currentTokenAmount = allChoices[currentChoiceIndex].tokenAmount;

        // Remove the switching choice itself
        removeChoice(currentApp, currentTokenAmount);

        // Clear the switching point
        clearAutoFilledChoices(currentApp);

        setCurrentScreen('choices');
        break;
      }
      case 'autoFilledExplanation': {
        // Going back from auto-filled explanation - clear auto-filled choices
        const currentApp = allChoices[currentChoiceIndex - 1]?.app || allChoices[0].app;
        clearAutoFilledChoices(currentApp);

        // Find the last manually answered question for this app
        const lastManualIndex = surveyData.choices.findIndex(
          choice => choice.app === currentApp && !choice.autoFilled
        );

        if (lastManualIndex !== -1) {
          // Find this question in allChoices
          const manualChoice = surveyData.choices[lastManualIndex];
          const indexInAllChoices = allChoices.findIndex(
            q => q.app === manualChoice.app && q.tokenAmount === manualChoice.tokenAmount
          );
          setCurrentChoiceIndex(indexInAllChoices);
        } else {
          // Default to first question of this app
          const firstIndexForApp = allChoices.findIndex(q => q.app === currentApp);
          setCurrentChoiceIndex(firstIndexForApp);
        }

        setCurrentScreen('choices');
        break;
      }
      case 'choices': {
        const currentApp = allChoices[currentChoiceIndex].app;

        // Check if this app has auto-filled choices (user might want to go back further)
        if (hasSwitchingPoint(currentApp)) {
          const previousIndex = currentChoiceIndex - 1;
          if (previousIndex >= 0 && allChoices[previousIndex].app !== currentApp) {
            // We're at the first question of an app with switching point
            // Go to auto-filled explanation screen
            const firstIndexForApp = allChoices.findIndex(q => q.app === currentApp);
            setCurrentChoiceIndex(firstIndexForApp + 1);
            setCurrentScreen('autoFilledExplanation');
            break;
          }
        }

        // Normal back navigation
        if (currentChoiceIndex === 6) {
          // Going back from first question of second app batch
          setCurrentScreen('appIntroduction2');
        } else if (currentChoiceIndex === 1) {
          // Going back from second question to choice comprehension
          setCurrentScreen('choiceComprehension');
        } else if (currentChoiceIndex > 0) {
          setCurrentChoiceIndex(currentChoiceIndex - 1);
        } else {
          setCurrentScreen('appIntroduction1');
        }
        break;
      }
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
          onSwitchingPointDetected={handleSwitchingPointDetected}
          onBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'choiceComprehension' && (
        <ChoiceComprehensionCheckScreen
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'switchingPointConfirmation' && (
        <SwitchingPointConfirmationScreen
          app={allChoices[currentChoiceIndex].app}
          onConfirm={goToNextScreen}
          onGoBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'autoFilledExplanation' && (
        <AutoFilledExplanationScreen
          app={allChoices[currentChoiceIndex - 1]?.app || allChoices[0].app}
          onNext={goToNextScreen}
          onGoBack={goToPreviousScreen}
        />
      )}
      {currentScreen === 'choicesSummary' && (
        <ChoicesSummaryScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen onNext={goToNextScreen} />
      )}
      {currentScreen === 'thankYou' && (
        <ThankYouScreen onStartNewSurvey={handleStartNewSurvey} />
      )}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <SurveyProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <SurveyFlow />
          </div>
          <SurveyFooter />
          <LanguageToggle />
        </div>
      </SurveyProvider>
    </LanguageProvider>
  );
}

export default App;
