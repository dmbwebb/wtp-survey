import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const projectId = 'demo-wtp-survey';
const surveyId = 'survey-under-test';
const survey = {
  deviceId: 'device-a',
  participantId: 'participant-under-test',
};

let testEnv;

function emulatorAddress() {
  const address = process.env.FIRESTORE_EMULATOR_HOST;
  assert.ok(address, 'FIRESTORE_EMULATOR_HOST must be set by firebase emulators:exec');

  const separator = address.lastIndexOf(':');
  assert.notEqual(separator, -1, `Invalid FIRESTORE_EMULATOR_HOST: ${address}`);

  return {
    host: address.slice(0, separator),
    port: Number(address.slice(separator + 1)),
  };
}

function surveyDoc(context, id = surveyId) {
  return doc(context.firestore(), 'surveys', id);
}

async function seedSurvey(data = survey) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(surveyDoc(context), data);
  });
}

before(async () => {
  const { host, port } = emulatorAddress();
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host,
      port,
      rules: await readFile(new URL('../../firestore.rules', import.meta.url), 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv?.cleanup();
});

describe('survey Firestore rules', () => {
  test('deny unauthenticated reads and writes', async () => {
    await seedSurvey();
    const context = testEnv.unauthenticatedContext();
    const reference = surveyDoc(context);

    await assertFails(getDoc(reference));
    await assertFails(getDocs(collection(context.firestore(), 'surveys')));
    await assertFails(setDoc(surveyDoc(context, 'new-survey'), survey));
    await assertFails(updateDoc(reference, { participantId: 'changed' }));
    await assertFails(deleteDoc(reference));
  });

  test('deny anonymous get and list', async () => {
    await seedSurvey();
    const context = testEnv.authenticatedContext('anonymous-user');

    await assertFails(getDoc(surveyDoc(context)));
    await assertFails(getDocs(collection(context.firestore(), 'surveys')));
  });

  test('allow anonymous create', async () => {
    const context = testEnv.authenticatedContext('anonymous-user');

    await assertSucceeds(setDoc(surveyDoc(context), survey));
  });

  test('allow anonymous same-device update', async () => {
    await seedSurvey();
    const context = testEnv.authenticatedContext('anonymous-user');

    await assertSucceeds(
      updateDoc(surveyDoc(context), { participantId: 'changed' }),
    );
  });

  test('deny anonymous update that changes deviceId', async () => {
    await seedSurvey();
    const context = testEnv.authenticatedContext('anonymous-user');

    await assertFails(updateDoc(surveyDoc(context), { deviceId: 'device-b' }));
  });

  test('deny anonymous delete', async () => {
    await seedSurvey();
    const context = testEnv.authenticatedContext('anonymous-user');

    await assertFails(deleteDoc(surveyDoc(context)));
  });

  test('allow privileged Admin SDK context to read', async () => {
    await seedSurvey();

    await testEnv.withSecurityRulesDisabled(async (context) => {
      const snapshot = await assertSucceeds(getDoc(surveyDoc(context)));
      assert.equal(snapshot.exists(), true);
    });
  });
});
