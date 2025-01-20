import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ToDo from '../ToDo.vue';

describe('ToDo', () => {
  it('renders static content properly', () => {
    const wrapper = mount(ToDo);

    // Statischer Inhalt überprüfen
    expect(wrapper.text()).toContain('To-do Liste'); // Überschrift
    expect(wrapper.text()).toContain('Kategorie:'); // Label für das Kategorie-Dropdown
    expect(wrapper.text()).toContain('Hinzufügen'); // Button zum Hinzufügen
  });

  it('renders input fields correctly', () => {
    const wrapper = mount(ToDo);

    // Eingabefelder finden und prüfen
    const todoInput = wrapper.find('input[placeholder="Neuen Eintrag hinzufügen"]');
    const categoryDropdown = wrapper.find('select');
    const addButton = wrapper.find('button');

    expect(todoInput.exists()).toBe(true); // Eingabefeld für neue To-dos
    expect(categoryDropdown.exists()).toBe(true); // Kategorie-Dropdown
    expect(addButton.exists()).toBe(true); // Hinzufügen-Button
  });
});
