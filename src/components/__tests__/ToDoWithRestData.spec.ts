import { describe, it, expect, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import axios from 'axios';
import ToDo from '../ToDo.vue';

vi.mock('axios'); // Mock Axios

describe('ToDoWithRestData', () => {
  it('should render the list of todos from backend', async () => {
    // Mock Daten vom Backend
    const mockTodos = [
      { id: 1, text: 'Pack sunscreen', category: 'Packliste', completed: false },
      { id: 2, text: 'Book flights', category: 'Vorbereitung', completed: true },
    ];

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: mockTodos });

    const wrapper = shallowMount(ToDo);

    await flushPromises();

    const todoItems = wrapper.findAll('.todo-item');
    expect(todoItems.length).toBe(mockTodos.length);
    expect(wrapper.text()).toContain('Pack sunscreen');
    expect(wrapper.text()).toContain('Book flights');
  });

  it('should fetch todos on mount and populate the list', async () => {
    // Mock-Daten, die vom Backend zurückgegeben werden
    const mockTodos = [
      { id: 1, text: 'Pack sunscreen', category: 'Packliste', completed: false },
      { id: 2, text: 'Book flights', category: 'Vorbereitung', completed: true },
    ];

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockTodos });

    const wrapper = shallowMount(ToDo);

    await flushPromises();

    expect(vi.mocked(axios.get)).toHaveBeenCalledWith('undefined/api/todos');

    expect(wrapper.vm.todos.length).toBe(mockTodos.length);
    expect(wrapper.vm.todos[0]).toEqual(mockTodos[0]);
    expect(wrapper.vm.todos[1]).toEqual(mockTodos[1]);

    const todoItems = wrapper.findAll('.todo-item');
    expect(todoItems.length).toBe(mockTodos.length);
    expect(wrapper.text()).toContain('Pack sunscreen');
    expect(wrapper.text()).toContain('Book flights');
  });

  it('should toggle the completed status of a todo', async () => {
    // Mock Backend-Daten
    const mockTodos = [
      { id: 1, text: 'Pack sunscreen', category: 'Packliste', completed: false },
    ];

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: mockTodos });
    vi.mocked(axios, true).put.mockResolvedValueOnce({}); // Mock für PUT-Aufruf

    // Komponente mounten
    const wrapper = shallowMount(ToDo);

    // Warten auf Backend-Antwort
    await flushPromises();


    const checkbox = wrapper.find('input[type="checkbox"]');
    const checkboxElement = checkbox.element as HTMLInputElement; // Explizite Typisierung

    // Checkbox toggeln
    await checkbox.setValue(true);


    expect(checkboxElement.checked).toBe(true);
    expect(vi.mocked(axios).put).toHaveBeenCalledWith(
      expect.stringContaining('/1'), // Prüfen, ob die ID korrekt ist
      expect.objectContaining({ completed: true }) // Aktualisierter Status
    );
  });
});
