import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BudgetPlaner from '../BudgetPlaner.vue';

describe('BudgetPlaner', () => {
  it('renders static content properly', () => {
    const wrapper = mount(BudgetPlaner);

    // Statischer Inhalt überprüfen
    expect(wrapper.text()).toContain('Budgetplaner'); // Überschrift
    expect(wrapper.text()).toContain('Gesamt Budget (€):'); // Label für Gesamtbudget
    expect(wrapper.text()).toContain('Kosten hinzufügen:'); // Label für Kosten
    expect(wrapper.text()).toContain('Ausrechnen'); // Berechnungsbutton
  });

  it('renders input fields correctly', () => {
    const wrapper = mount(BudgetPlaner);

    // Eingabefelder finden und prüfen
    const totalBudgetInput = wrapper.find('input#totalBudget');
    const descriptionInput = wrapper.find('input[placeholder="Beschreibung"]');
    const costInput = wrapper.find('input[placeholder="Kosten (€)"]');

    expect(totalBudgetInput.exists()).toBe(true); // Gesamtbudgetfeld
    expect(descriptionInput.exists()).toBe(true); // Beschreibungsfeld
    expect(costInput.exists()).toBe(true); // Kostenfeld
  });
});
