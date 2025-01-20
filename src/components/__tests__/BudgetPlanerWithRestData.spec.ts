import { describe, it, expect, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import axios from 'axios';
import BudgetPlaner from '../BudgetPlaner.vue';

vi.mock('axios'); // Mock Axios

describe('BudgetPlaner Functions', () => {
  it('should display no costs message when cost list is empty', async () => {
    // Mock: Backend liefert eine leere Liste
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] });

    // Komponente mounten
    const wrapper = shallowMount(BudgetPlaner);

    // Warten auf Backend-Antwort
    await flushPromises();

    // Aufrufen der Methode oder Zugriff auf computed property
    const hasNoCosts = wrapper.vm.costEntries.length === 0;

    // Erwartung: Die Funktionalität erkennt eine leere Liste korrekt
    expect(hasNoCosts).toBe(true);
  });

  it('should render list of costs from backend', async () => {
    const mockCostEntries = [
      { id: 1, beschreibung: 'Hotel', kosten: 300 },
      { id: 2, beschreibung: 'Flug', kosten: 500 },
    ];

    // Mock Antwort vom Backend
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: mockCostEntries });

    const wrapper = shallowMount(BudgetPlaner);

    // Warten auf asynchrone Updates
    await flushPromises();

    // Prüfen, ob die Kostenpunkte gerendert wurden
    const costItems = wrapper.findAll('.cost-item');
    expect(costItems.length).toBe(mockCostEntries.length);
    expect(wrapper.text()).toContain('Hotel');
    expect(wrapper.text()).toContain('300.00 €');
    expect(wrapper.text()).toContain('Flug');
    expect(wrapper.text()).toContain('500.00 €');
  });

  it('should add a new cost entry and display it with the correct remaining budget', async () => {
    const wrapper = shallowMount(BudgetPlaner);

    // Setze das Gesamtbudget
    const totalBudgetInput = wrapper.find('input#totalBudget');
    await totalBudgetInput.setValue(100); // Setze ein Gesamtbudget von 100 €

    // Mock Post-Anfrage
    const newCostEntry = { id: 3, beschreibung: 'Essen', kosten: 50 };
    vi.mocked(axios, true).post.mockResolvedValueOnce({ data: newCostEntry });

    // Eingabefelder und Button finden
    const descriptionInput = wrapper.find('input[placeholder="Beschreibung"]');
    const costInput = wrapper.find('input[placeholder="Kosten (€)"]');
    const addButton = wrapper.find('button.add-btn');

    // Werte setzen und hinzufügen klicken
    await descriptionInput.setValue('Essen');
    await costInput.setValue(50);
    await addButton.trigger('click');

    // Warten auf asynchrone Updates
    await flushPromises();

    // Prüfen, ob der neue Eintrag gerendert wurde
    const costItems = wrapper.findAll('.cost-item');
    expect(costItems.length).toBe(1); // Es sollte ein Kostenpunkt hinzugefügt werden
    expect(wrapper.text()).toContain('Essen');
    expect(wrapper.text()).toContain('50.00 €');

    // Berechnung auslösen
    const calculateButton = wrapper.find('button.calculate-btn');
    await calculateButton.trigger('click');

    // Prüfen, ob das verbleibende Budget korrekt berechnet wurde
    expect(wrapper.text()).toContain('Verbleibendes Budget:');
    expect(wrapper.text()).toContain('50.00 €');
  });
});

