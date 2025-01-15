
<template>
  <div class="map-page">
    <!-- Suchleiste und Knöpfe -->
    <div class="top-bar">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Land suchen"
        class="search-bar"
      />
      <button @click="markAsVisited" class="button visited-button">
        Besucht
      </button>
      <button @click="markAsPlanned" class="button planned-button">
        Geplant
      </button>
      <button @click="deleteCountry" class="button delete-button">
        Entfernen
      </button>
    </div>

    <!-- Weltkarte -->
    <div id="map" class="map"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import mapboxgl, { Map, GeoJSONSource } from "mapbox-gl";
import type { FeatureCollection } from "geojson";
import { countries } from '@/Model/countries'

export default defineComponent({
  name: "WeltKarte",
  setup() {
    const searchTerm = ref<string>(""); // Suchleiste mit String
    const map = ref<Map | null>(null); // Typ Map für Mapbox
    const geojsonData = ref<FeatureCollection | null>(null); // Typ FeatureCollection für GeoJSON-Daten


    // Markiere ein Land als besucht
    const markAsVisited = () => {
      if (!searchTerm.value.trim()) {
        alert("Bitte ein Land eingeben!");
        return;
      }
      const countryName = searchTerm.value.trim();

      const feature = geojsonData.value?.features.find(
        (f) =>
          f.properties &&
          f.properties.name &&
          f.properties.name.toLowerCase() === countryName.toLowerCase()
      );

      if (feature) {
        feature.properties = { ...feature.properties, highlight: "visited" };
        updateGeoJSON();
      } else {
        alert("Land nicht gefunden!");
      }
    };

    // Funktion zum Löschen eines Landes
    const deleteCountry = () => {
      if (!searchTerm.value.trim()) {
        alert("Bitte ein Land eingeben!");
        return;
      }
      const countryName = searchTerm.value.trim();

      const feature = geojsonData.value?.features.find(
        (f) =>
          f.properties &&
          f.properties.name &&
          f.properties.name.toLowerCase() === countryName.toLowerCase()
      );

      if (feature) {
        // Highlight-Eigenschaft löschen
        feature.properties = { ...feature.properties, highlight: null };
        updateGeoJSON(); // GeoJSON-Daten aktualisieren
        alert(`${countryName} wurde erfolgreich zurückgesetzt.`);
      } else {
        alert("Land nicht gefunden!");
      }
    };


    // Markiere ein Land als geplant
    const markAsPlanned = () => {
      if (!searchTerm.value.trim()) {
        alert("Bitte ein Land eingeben!");
        return;
      }
      const countryName = searchTerm.value.trim();

      const feature = geojsonData.value?.features.find(
        (f) =>
          f.properties &&
          f.properties.name &&
          f.properties.name.toLowerCase() === countryName.toLowerCase()
      );

      if (feature) {
        feature.properties = { ...feature.properties, highlight: "planned" };
        updateGeoJSON();
      } else {
        alert("Land nicht gefunden!");
      }
    };

    // Aktualisiere die GeoJSON-Daten in der Karte
    const updateGeoJSON = () => {
      if (map.value?.getSource("countries")) {
        (map.value.getSource("countries") as GeoJSONSource).setData(
          geojsonData.value!
        );
      }
    };

    onMounted(() => {

      mapboxgl.accessToken = "pk.eyJ1IjoiZXlsdXYiLCJhIjoiY201djNtbzdpMDNwcDJpcjF5c24xenN0MiJ9.DA9LH7DAX9ik5ygPevm3Kw";

      const mapLocal =  new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [35, 40],
        zoom: 2,
      });

      mapLocal.on("load", () => {





        geojsonData.value = countries;

        mapLocal.addSource("countries", {
          type: "geojson",
          data: geojsonData.value,
        });

        // Layer für Länder hinzufügen
        mapLocal.addLayer({
          id: "country-fills",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": [
              "match",
              ["get", "highlight"],
              "visited",
              "#a83580", // Blau für besucht
              "planned",
              "#441c95", // Lila für geplant
              "rgba(204,204,204,0)", // Standardfarbe (Grau)
            ],
            "fill-opacity": 0.6,
          },
        });

        // Länderumrisse hinzufügen
        mapLocal.addLayer({
          id: "country-borders",
          type: "line",
          source: "countries",
          paint: {
            "line-color": "rgba(0,0,0,0)",
            "line-width": 1,
          },
        });
      });

      map.value = mapLocal;
    });

    return {
      searchTerm,
      markAsVisited,
      markAsPlanned,
      deleteCountry,
    };
  },
});
</script>

<style scoped>

.map-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%; /* Nutzt die gesamte Breite */
  padding: 0;
  overflow: hidden;
  margin-left: -185px;
}

.map {
  flex: 1;
  width: 1280px; /* Nutzt die gesamte Breite */
  height: 700px; /* Höhe mit Platz für die Leiste */

}

/* Leistenbereich oben */
.top-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 3px;
  padding: 8px 15px;
  background-color: #1a1a1a;
  box-shadow: 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* Suchleiste */
.search-bar {
  flex: 1;
  max-width: 900px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* Buttons */
.button {
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;

}

.visited-button {
  background-color: #a83580;
  color: white;
}

.planned-button {
  background-color: #240e53;
  color: white;
}

.visited-button:hover {
  background-color: #a83580;
}

.delete-button {
  background-color: #dc3545; /* Rot */
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.planned-button:hover {
  background-color: #240e53;
}
</style>
