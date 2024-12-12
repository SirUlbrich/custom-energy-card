import { CustomEnergyCard } from "./custom-energy-card";
import { EnergyCardEditor } from "./energy-card-editor";

customElements.define("custom-energy-card",CustomEnergyCard);
customElements.define('energy-card-editor', EnergyCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "custom-energy-card",
    name: "CustomEnergyCard",
    description: "Mein Testversuch!" // optional
});