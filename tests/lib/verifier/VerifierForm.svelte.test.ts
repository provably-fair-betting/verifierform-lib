import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, test, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import VerifierForm from '$lib/verifier/VerifierForm.svelte';
import TestResult from './DummyResultForTest.svelte';
import TestExplanation from './DummyExplanationForTest.svelte';
import userEvent from '@testing-library/user-event';
import type { AfterNavigate } from '@sveltejs/kit';
import { tick } from 'svelte';
import { z } from 'zod';
import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '../../../src/demo/control-setup';
import type { GameDefinition, GameEntry } from '$lib/verifier/types';

const CRASH_SEED = '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4';
const SLIDE_SEEDS = [
  '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
  '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944',
];

// Use vi.hoisted to define variables accessible in the mock factory
const {
  gotoSpy,
  afterNavigateCallbackRef,
  pageStateRef,
}: {
  gotoSpy: Mock;
  afterNavigateCallbackRef: {
    current: ((navigation: AfterNavigate) => void | Promise<void>) | null;
  };
  pageStateRef: {
    current: { url: URL | null };
  };
} = vi.hoisted(() => {
  return {
    gotoSpy: vi.fn(),
    afterNavigateCallbackRef: { current: null },
    pageStateRef: { current: { url: null } },
  };
});

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
  goto: gotoSpy,
  afterNavigate: (fn: (navigation: AfterNavigate) => void | Promise<void>) => {
    afterNavigateCallbackRef.current = fn;
  },
}));

// Mock $app/state
vi.mock('$app/state', () => {
  const page = {
    url: new URL('http://localhost:8080/?game=dice&clientseed=123&serverseed=456&nonce=0'),
  };
  pageStateRef.current = page;
  return { page };
});

function makeEntry(def: GameDefinition): GameEntry {
  return { name: def.name, loader: () => Promise.resolve(def) };
}

describe('VerifierForm Component', () => {
  beforeEach(async () => {
    vi.useFakeTimers();

    pageStateRef.current.url = new URL(
      new URL('http://localhost:8080/?game=dice&clientseed=123&serverseed=456&nonce=0')
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('url query param <-> state binding', () => {
    test('url query params are loaded into state', async () => {
      await setupVerifierForm();

      expect(getGameTrigger()).toHaveTextContent('dice');

      const clientSeed = screen.getByLabelText(/Client Seed\*/);
      expect(clientSeed).toHaveValue('123');

      const serverSeed = screen.getByLabelText(/Server Seed\*/);
      expect(serverSeed).toHaveValue('456');

      const nonce = screen.getByLabelText(/Nonce\*/);
      expect(nonce).toHaveValue(0);
    });

    test('url query params are loaded into state (roulette)', async () => {
      pageStateRef.current.url = new URL(
        'http://localhost:8080/?game=roulette&clientseed=123&serverseed=456&nonce=0'
      );

      await setupVerifierForm();

      expect(getGameTrigger()).toHaveTextContent('roulette');

      const clientSeed = screen.getByLabelText(/Client Seed\*/);
      expect(clientSeed).toHaveValue('123');

      const serverSeed = screen.getByLabelText(/Server Seed\*/);
      expect(serverSeed).toHaveValue('456');

      const nonce = screen.getByLabelText(/Nonce\*/);
      expect(nonce).toHaveValue(0);
    });

    test('url query params are loaded into state (crash)', async () => {
      pageStateRef.current.url = new URL('http://localhost:8080/?game=crash&gamehash=123');

      await setupVerifierForm();

      expect(getGameTrigger()).toHaveTextContent('Crash');

      const gameHash = screen.getByLabelText(/Game Hash\*/);
      expect(gameHash).toHaveValue('123');

      const blockHash = screen.getByLabelText(/Block Hash/);
      expect(blockHash).toHaveValue(CRASH_SEED);
      expect(blockHash).toBeDisabled();
    });

    test('state changes propagate to url query params', async () => {
      await setupVerifierForm();

      expect(getGameTrigger()).toHaveTextContent('dice');

      const clientSeed = screen.getByLabelText(/Client Seed\*/);
      await fireEvent.input(clientSeed, { target: { value: 'abc' } });

      const serverSeed = screen.getByLabelText(/Server Seed\*/);
      await fireEvent.input(serverSeed, { target: { value: 'bcd' } });

      const nonce = screen.getByLabelText(/Nonce\*/);
      await fireEvent.input(nonce, { target: { value: 2 } });

      await vi.advanceTimersByTimeAsync(350);

      expect(gotoSpy).toHaveBeenCalledOnce();

      const [urlArg] = gotoSpy.mock.calls[0];
      expect(urlArg).toContain('game=dice');
      expect(urlArg).toContain('clientseed=abc');
      expect(urlArg).toContain('serverseed=bcd');
      expect(urlArg).toContain('nonce=2');
    });

    test('url query param changes propagate to state', async () => {
      await setupVerifierForm();

      await navigateTo(
        new URL('http://localhost:8080/?game=dice&clientseed=999&serverseed=012&nonce=5')
      );

      expect(getGameTrigger()).toHaveTextContent('dice');

      const clientSeed = screen.getByLabelText(/Client Seed\*/);
      expect(clientSeed).toHaveValue('999');

      const serverSeed = screen.getByLabelText(/Server Seed\*/);
      expect(serverSeed).toHaveValue('012');

      const nonce = screen.getByLabelText(/Nonce\*/);
      expect(nonce).toHaveValue(5);
    });
  });

  test('result is shown when all required fields are filled and explanation is toggleable', async () => {
    const { user } = await setupVerifierForm();

    const clientSeed = screen.getByLabelText(/Client Seed\*/);
    await user.clear(clientSeed);
    await user.type(clientSeed, 'aaa');

    const serverSeed = screen.getByLabelText(/Server Seed\*/);
    await user.clear(serverSeed);
    await user.type(serverSeed, 'bbb');

    const nonce = screen.getByLabelText(/Nonce\*/);
    await user.clear(nonce);
    await user.type(nonce, '123');

    await vi.advanceTimersByTimeAsync(350);

    expect(
      await screen.findByText('Result for clientSeed=aaa serverSeed=bbb nonce=123')
    ).toBeInTheDocument();

    expect(screen.queryByText('Explanation for')).not.toBeInTheDocument();

    const explanationBtn = screen.getByText('Show Explanation');
    await user.click(explanationBtn);

    expect(explanationBtn).toHaveTextContent('Hide Explanation');
    expect(
      await screen.findByText('Explanation for clientSeed=aaa serverSeed=bbb nonce=123')
    ).toBeInTheDocument();
  });

  test('optional fields are passed to result and explanation', async () => {
    const { user } = await setupVerifierForm();

    const clientSeed = screen.getByLabelText(/Client Seed\*/);
    await user.clear(clientSeed);
    await user.type(clientSeed, 'aaa1');

    const serverSeed = screen.getByLabelText(/Server Seed\*/);
    await user.clear(serverSeed);
    await user.type(serverSeed, 'bbb2');

    const nonce = screen.getByLabelText(/Nonce\*/);
    await user.clear(nonce);
    await user.type(nonce, '1234');

    const optional = screen.getByLabelText(/Optional/);
    await user.clear(optional);
    await user.type(optional, 'yes1');

    await vi.advanceTimersByTimeAsync(350);

    expect(
      await screen.findByText('Result for clientSeed=aaa1 serverSeed=bbb2 nonce=1234 optional=yes1')
    ).toBeInTheDocument();

    const explanationBtn = screen.getByText('Show Explanation');
    await user.click(explanationBtn);

    expect(explanationBtn).toHaveTextContent('Hide Explanation');
    expect(
      await screen.findByText(
        'Explanation for clientSeed=aaa1 serverSeed=bbb2 nonce=1234 optional=yes1'
      )
    ).toBeInTheDocument();
  });

  test('game change resets input fields', async () => {
    const { user } = await setupVerifierForm();

    const clientSeed = screen.getByLabelText(/Client Seed\*/);
    await user.clear(clientSeed);
    await user.type(clientSeed, 'aaa');

    const serverSeed = screen.getByLabelText(/Server Seed\*/);
    await user.clear(serverSeed);
    await user.type(serverSeed, 'bbb');

    const nonce = screen.getByLabelText(/Nonce\*/);
    await user.clear(nonce);
    await user.type(nonce, '123');

    const optional = screen.getByLabelText(/Optional/);
    await user.clear(optional);
    await user.type(optional, 'yes');

    await selectGame(user, 'roulette');
    // changeGame is async (activeDefinition + formValues update in separate batches)
    await waitFor(() => expect(gotoSpy).toHaveBeenCalledOnce());
    await tick(); // flush activeDefinition batch
    await tick(); // flush formValues batch
    const [urlArg] = gotoSpy.mock.calls[0];
    expect(urlArg).toBe('?game=roulette&nonce=0');

    await navigateTo(new URL('http://localhost:8080/?game=roulette&nonce=0'));

    // Re-query after game change — controls are recreated by the loading state transition
    expect(getGameTrigger()).toHaveTextContent('roulette');
    expect(screen.getByLabelText(/Client Seed\*/)).toHaveValue('');
    expect(screen.getByLabelText(/Server Seed\*/)).toHaveValue('');
    expect(screen.getByLabelText(/Nonce\*/)).toHaveValue(0);
    expect(screen.queryByLabelText(/Optional/)).not.toBeInTheDocument();
  });

  test('invalid game causes redirect to first game in dropdown', async () => {
    await setupVerifierForm();

    await navigateTo(new URL('http://localhost:8080/?game=invalid'));

    expect(gotoSpy).toHaveBeenCalledOnce();
    const [urlArg] = gotoSpy.mock.calls[0];
    expect(urlArg).toBe('?game=dice&nonce=0');
  });

  test('invalid option causes reset to the first option', async () => {
    await navigateTo(
      new URL('http://localhost:8080/?game=slide&slidehash=123&blockhash=' + SLIDE_SEEDS[1])
    );

    await setupVerifierForm();

    expect(getGameTrigger()).toHaveTextContent('Slide');

    const slidehash = screen.getByLabelText(/Slide Hash\*/);
    expect(slidehash).toHaveValue('123');

    const blockhash = screen.getByLabelText(/Block Hash/);
    expect(blockhash).toHaveValue(SLIDE_SEEDS[1]);

    await navigateTo(new URL('http://localhost:8080/?game=slide&slidehash=123&blockhash=456'));

    expect(gotoSpy).toHaveBeenCalledOnce();
    const [urlArg] = gotoSpy.mock.calls[0];
    expect(urlArg).toContain('?game=slide');
    expect(urlArg).toContain('slidehash=123');
    expect(urlArg).toContain('blockhash=' + SLIDE_SEEDS[0]);
  });

  describe('field presence check', () => {
    test('presence check not met when entering form', async () => {
      await navigateTo(new URL('http://localhost:8080/?game=plinko&nonce=0&risk=norow'));

      const { user } = await setupVerifierForm();

      //rows is not present
      expect(screen.queryByLabelText(/Rows\*/)).not.toBeInTheDocument();

      //set risk to low
      const risk = screen.getByLabelText(/Risk/);
      await user.selectOptions(risk, 'low');

      //rows is present and set to default
      const rows = await screen.findByLabelText(/Rows\*/);
      expect(rows).toBeInTheDocument();
      expect(rows).toHaveValue(8);
    });

    test('presence check not met when interacting with form', async () => {
      const { user } = await setupVerifierForm();

      await navigateTo(new URL('http://localhost:8080/?game=plinko&rows=16'));

      const rows = screen.getByLabelText(/Rows\*/);

      //rows is present
      expect(rows).toBeInTheDocument();
      expect(rows).toHaveValue(16);

      //set risk to norow
      const risk = screen.getByLabelText(/Risk/);
      await user.selectOptions(risk, 'norow');

      vi.advanceTimersByTime(350);

      //check goto was called
      const [urlArg] = gotoSpy.mock.lastCall!;
      expect(urlArg).toContain('game=plinko');
      expect(urlArg).toContain('risk=norow');
      expect(urlArg).toContain('nonce=0');
      expect(urlArg).not.toContain('rows');

      //wait for rows to be not present
      expect(rows).not.toBeInTheDocument();

      //simulate navigation
      await navigateTo(new URL('http://localhost:8080/?game=plinko&risk=norow&nonce=0'));

      //set risk to high
      await user.selectOptions(risk, 'high');

      vi.advanceTimersByTime(350);

      //check goto was called
      const [urlArg2] = gotoSpy.mock.lastCall!;
      expect(urlArg2).toContain('game=plinko');
      expect(urlArg2).toContain('risk=high');
      expect(urlArg2).toContain('nonce=0');
      expect(urlArg2).toContain('rows=8');
    });
  });

  describe('default values set if not provided', () => {
    test('mount hook', async () => {
      await setupVerifierForm();

      // set default values
      await navigateTo(new URL('http://localhost:8080/?game=plinko'));

      expect(getGameTrigger()).toHaveTextContent('plinko');

      const risk = screen.getByLabelText(/Risk/);
      expect(risk).toHaveValue('low');

      const rows = screen.getByLabelText(/Rows\*/);
      expect(rows).toHaveValue(8);

      expect(gotoSpy).toHaveBeenCalledOnce();
      const [urlArg] = gotoSpy.mock.calls[0];
      expect(urlArg).toContain('?game=plinko');
      expect(urlArg).toContain('risk=low');
      expect(urlArg).toContain('rows=8');
    });

    test('game change', async () => {
      const { user } = await setupVerifierForm();

      await selectGame(user, 'plinko');
      await tick();

      const risk = screen.getByLabelText(/Risk/);
      expect(risk).toHaveValue('low');

      const rows = screen.getByLabelText(/Rows\*/);
      expect(rows).toHaveValue(8);

      expect(gotoSpy).toHaveBeenCalledOnce();
      const [urlArg] = gotoSpy.mock.calls[0];
      expect(urlArg).toContain('?game=plinko');
      expect(urlArg).toContain('risk=low');
      expect(urlArg).toContain('rows=8');
    });
  });

  test('empty params are removed from url', async () => {
    await setupVerifierForm();

    //trigger first navigation check
    await navigateTo(new URL('http://localhost:8080/?game=dice&nonce=0'));

    //navigate to url having empty param - check before advancing timers
    //because formValues won't include the empty param, and this should be stable
    pageStateRef.current.url = new URL('http://localhost:8080/?game=dice&clientseed=&nonce=0');
    await afterNavigateCallbackRef?.current?.({
      from: { url: new URL('http://localhost:8080/?game=dice&nonce=0') },
      to: { url: new URL('http://localhost:8080/?game=dice&clientseed=&nonce=0') },
      willUnload: false,
      type: 'link',
      complete: Promise.resolve(),
    } as unknown as AfterNavigate);
    await tick();

    //goto will not be called since urls are the same
    expect(gotoSpy).toHaveBeenCalledTimes(0);
  });

  function getGameTrigger() {
    return screen.getByRole('button', { name: /^select game:/i });
  }

  async function selectGame(user: ReturnType<typeof userEvent.setup>, gameId: string) {
    await user.click(getGameTrigger());
    await user.click(screen.getByRole('option', { name: new RegExp(gameId, 'i') }));
  }

  async function setupVerifierForm() {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const diceDefinition: GameDefinition = {
      name: 'dice',
      schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
      controls: [
        ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
        {
          id: 'optional',
          label: 'Optional',
          type: 'text',
          required: false,
        },
      ],
      result: TestResult,
      explanation: TestExplanation,
    };

    const crashDefinition: GameDefinition = {
      name: 'Crash',
      schema: z.object({
        gamehash: z.string(),
      }),
      controls: [
        {
          id: 'gamehash',
          label: 'Game Hash',
          type: 'text',
          required: true,
        },
        {
          id: 'blockhash',
          label: 'Block Hash',
          type: 'static',
          value: CRASH_SEED,
        },
      ],
      result: TestResult,
      explanation: TestExplanation,
    };

    const slideDefinition: GameDefinition = {
      name: 'Slide',
      schema: z.object({
        slidehash: z.string(),
        blockhash: z.string(),
      }),
      controls: [
        {
          id: 'slidehash',
          label: 'Slide Hash',
          type: 'text',
          required: true,
        },
        {
          id: 'blockhash',
          label: 'Block Hash',
          type: 'select',
          syncToUrl: true,
          options: SLIDE_SEEDS,
        },
      ],
      result: TestResult,
      explanation: TestExplanation,
    };

    const rouletteDefinition: GameDefinition = {
      name: 'roulette',
      schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
      controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
      result: TestResult,
      explanation: TestExplanation,
    };

    const plinkoDefinition: GameDefinition = {
      name: 'plinko',
      schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
        risk: z.enum(['low', 'medium', 'high', 'norow']),
        rows: z.number().min(8).max(16),
      }),
      controls: [
        ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
        {
          id: 'risk',
          label: 'Risk',
          type: 'select',
          options: ['low', 'medium', 'high', 'norow'],
        },
        {
          id: 'rows',
          label: 'Rows',
          type: 'number',
          required: true,
          hide: (formValues) => formValues?.risk === 'norow',
          default: 8,
          min: 8,
          max: 16,
        },
      ],
      result: TestResult,
      explanation: TestExplanation,
    };

    const games: Record<string, GameEntry> = {
      dice: makeEntry(diceDefinition),
      crash: makeEntry(crashDefinition),
      slide: makeEntry(slideDefinition),
      roulette: makeEntry(rouletteDefinition),
      plinko: makeEntry(plinkoDefinition),
    };

    render(VerifierForm, { props: { games } });

    // Wait for onMount to pre-load the initial game definition.
    // Two ticks: one to process the $effect/onMount, one for the async loader microtask.
    await tick();
    await tick();

    return { user };
  }

  async function navigateTo(newUrl: URL) {
    pageStateRef.current.url = newUrl;

    await afterNavigateCallbackRef?.current?.({
      from: { url: new URL('http://localhost:8080/?game=dice&clientseed=123&serverseed=456') },
      to: { url: newUrl },
      willUnload: false,
      type: 'link',
      complete: Promise.resolve(),
    } as unknown as AfterNavigate);

    await tick();
    await vi.advanceTimersByTimeAsync(350);
  }
});
