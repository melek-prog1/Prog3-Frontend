<template>
  <div class="budget-planer">
    <h1>Budgetplaner</h1>

    <!-- Gesamt Budget -->
    <div class="budget-input">
      <label for="totalBudget">Gesamt Budget (€):</label>
      <input
        id="totalBudget"
        type="number"
        v-model.number="totalBudget"
        placeholder="Gesamtbudget eingeben"
        step="0.01"
        min="0"
      />
    </div>

    <!-- Kosten hinzufügen -->
    <div class="costs-section">
      <label>Kosten hinzufügen:</label>
      <div class="add-cost">
        <input
          type="text"
          v-model="newCost.beschreibung"
          placeholder="Beschreibung"
        />
        <input
          type="number"
          v-model.number="newCost.kosten"
          placeholder="Kosten (€)"
          step="0.01"
          min="0"
        />
        <button
          @click="addCostEntry"
          class="add-btn"
          :disabled="!isValidNewCost"
        >
          Hinzufügen
        </button>

      </div>

      <!-- Kostenliste -->
      <ul class="cost-list">
        <li
          v-for="(entry, index) in costEntries"
          :key="index"
          class="cost-item"
        >
          <span class="cost-description">{{ entry.beschreibung }}</span>
          <span class="cost-amount">{{ entry.kosten.toFixed(2) }} €</span>
          <button
            @click="confirmDeleteCostEntry((entry.id ?? -1))"
            class="delete-btn"
          >🗑️</button>
        </li>
      </ul>
    </div>


    <!-- Ergebnis -->
    <div class="result-section">
      <button @click="calculateBudget" class="calculate-btn">Ausrechnen</button>
      <p v-if="calculated" class="result-text">
        Verbleibendes Budget:
        <strong
          :class="{
            positive: remainingBudget >= 0,
            negative: remainingBudget < 0,
          }"
        >
          {{ remainingBudget.toFixed(2) }} €
        </strong>
      </p>

    </div>

    <!-- Toast Nachricht -->

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";
import type { BudgetPlan } from '@/Model/BudgetPlaner'

export default defineComponent({
  name: "BudgetPlaner",
  setup() {
    const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL + "/api/budget";
    const totalBudget = ref<number>(0); // Gesamtbudget
    const costEntries = ref<BudgetPlan[]>([]); // Liste der Kosten
    const newCost = ref<BudgetPlan>({ beschreibung: "", kosten: 0 }); // Neues Kostenelement
    const remainingBudget = ref<number>(0); // Verbleibendes Budget
    const calculated = ref<boolean>(false); // Status für Berechnung
    const toastMessage = ref<string>(""); // Toast-Nachricht

    // Toast Nachricht anzeigen
    const showToast = (message: string) => {
      toastMessage.value = message;
      setTimeout(() => {
        toastMessage.value = "";
      }, 3000);
    };

    const addCostEntry = async () => {
      if (!newCost.value.beschreibung.trim() || newCost.value.kosten <= 0) {
        showToast("Bitte gültige Werte eingeben.");
        return;
      }

      console.log("Sende folgende Daten an das Backend:", {
        beschreibung: newCost.value.beschreibung,
        kosten: newCost.value.kosten,
        budget: totalBudget.value,
      });

      try {
        const response = await axios.post(baseUrl, {
          beschreibung: newCost.value.beschreibung,
          kosten: newCost.value.kosten,
          budget: totalBudget.value,
        });

        costEntries.value.push(response.data);
        newCost.value = { beschreibung: "", kosten: 0 }; // Reset der Eingabe
        showToast("Kosten erfolgreich hinzugefügt!");
      } catch (error) {
        console.error("Fehler beim Hinzufügen eines Eintrags:", error);
        showToast("Fehler beim Speichern der Kosten.");
      }
    };

    const confirmDeleteCostEntry = async (id: number) => {
      try {
        await axios.delete(`${baseUrl}/${id}`);
        costEntries.value = costEntries.value.filter((entry) => entry.id !== id);
        // Entferne die Toast-Nachricht
        console.log("Eintrag erfolgreich gelöscht!");
      } catch (error) {
        console.error("Fehler beim Löschen des Eintrags:", error);
      }
    };

    // Berechnung des verbleibenden Budgets
    const totalCosts = computed(() =>
      costEntries.value.reduce((sum, entry) => sum + entry.kosten, 0)
    );

    const calculateBudget = () => {
      if (totalBudget.value <= 0) {
        showToast("Bitte geben Sie ein gültiges Gesamtbudget ein.");
        return;
      }

      remainingBudget.value = totalBudget.value - totalCosts.value;
      calculated.value = true;

      if (remainingBudget.value < 0) {
        showToast("Achtung: Das Budget wurde überschritten!");
      }
    };

    // Backend: Gesamtes Budget und Kosten speichern
    const saveBudget = async () => {
      try {
        await axios.put(baseUrl, {
          totalBudget: totalBudget.value,
          remainingBudget: remainingBudget.value,
          costs: costEntries.value,
        });


      } catch (error) {
        console.error("Fehler beim Speichern:", error);
        showToast("Fehler beim Speichern des Budgets.");
      }
    };

    // Daten beim Laden holen
    onMounted(async () => {
      try {
        const response = await axios.get(baseUrl);
        costEntries.value = response.data;

      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        showToast("Fehler beim Laden der Daten.");
      }
    });

    const isValidNewCost = computed(() => {
      return newCost.value.beschreibung.trim() !== "" && newCost.value.kosten > 0;
    });

    return {
      totalBudget,
      costEntries,
      newCost,
      remainingBudget,
      calculated,
      toastMessage,
      addCostEntry,
      confirmDeleteCostEntry,
      calculateBudget,
      saveBudget,
      totalCosts,
      isValidNewCost,
    };
  },
});
</script>

<style scoped>
.budget-planer {
  font-family: Arial, sans-serif;
  margin-left: 120px;
  padding: 20px;
  border-radius: 10px;
  background: rgba(126, 126, 126, 0);
  display: flex;
  flex-direction: column;
  gap: 20px; /* Abstand zwischen Abschnitten */
  max-width: 600px; /* Maximale Breite für die gesamte Box */
  align-items: center; /* Zentriert Inhalte horizontal */

}

/* Überschrift */
h1 {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

/* Eingabefelder und Abschnitte */
.budget-input,
.add-cost {
  display: flex;
  flex-direction: column; /* Vertikale Anordnung */
  gap: 10px;
  width: 400px; /* Volle Breite für Eingaben */
  margin-bottom: 20px; /* Abstand zu anderen Abschnitten */
}

label {
  font-weight: bold;
  color: white;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(221, 221, 221, 0.22);
  background-color: #333; /* Dunkler Hintergrund */
  color: white;
}

input::placeholder {
  color: #bbb; /* Farbe des Platzhalters */
}

/* Kostenliste mit Scroll-Funktion */
.cost-list {
    width: 100%; /* Volle Breite */
    height: 150px; /* Feste Höhe für den Scrollbereich */
    overflow-y: auto; /* Aktiviert Scrollen bei Bedarf */
    padding: 15px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.09);
}

/* Einzelne Kosten */
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 5px;
  border-radius: 10px;
  background-color: rgba(250, 248, 249, 0.96);
}

.cost-description {
  flex: 2;
  color: #000;
}

.cost-amount {
  flex: 1;
  font-weight: bold;
  text-align: right;
  color: #000;
}

/* Buttons */
button {
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.add-btn {
  background-color: #a83580;
  color: white;
  border: none;
}

.add-btn:hover {
  background-color: #87005a;
}


.calculate-btn {
  background-color: #4e056d;
  color: white;
  border: none;
  margin-top: 20px;
  padding: 10px 20px;
  width: 100%; /* Volle Breite */
}

.calculate-btn:hover {
  background-color: #32003b;
}

/* Ergebnisbereich */
.result-section {
  margin-top: 20px;
  text-align: center;
}

.result-section strong {
  font-size: 1.5rem;
  color: white;
}

.positive {
  color: #47d547 !important;
  font-size: 1rem !important;
  font-weight: bold !important;
}

.negative {
  color: #ff4d4d !important;
  font-size: 1rem !important;
  font-weight: bold !important;
}
.delete-btn {

  color: white; /* Weiße Schrift */
  border: none;
  border-radius: 5px;
  width: 30px; /* Breite */
  height: 30px; /* Höhe */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0; /* Entferne zusätzliches Padding */
  cursor: pointer;
  font-size: 1.0rem; /* Größeres Icon */
}
</style>
