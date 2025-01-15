<template>
  <div class="budget-planer">
    <h1>Budget Planner</h1>

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
            @click="confirmDeleteCostEntry(entry.id)"
            class="delete-btn"
          >
            Löschen
          </button>
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
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>
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
.budget-planner {
  font-family: "Poppins", Arial, sans-serif;
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: rgba(126, 126, 126, 0.1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeInOut 3s ease;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Setzt Textfarbe für den Titel und Beschriftungen */
h1,
label {
  font-weight: bold;
  color: white; /* Weiß für den Titel und die Beschriftungen */
}

input,
button {
  color: #333; /* Setzt die Textfarbe der Eingabefelder und Buttons auf dunkel */
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
}

.cost-description,
.cost-amount {
  color: #333; /* Setzt die Textfarbe auf dunkel */
}

.cost-amount {
  font-weight: bold;
}

.calculate-btn {
  background-color: #007bff;
}

.calculate-btn:hover {
  background-color: #0056b3;
}

</style>
