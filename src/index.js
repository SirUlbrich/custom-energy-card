import { CustomEnergyCard } from "./custom-energy-card";


customElements.define(
    "custom-energy-card",
    CustomEnergyCard
);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "custom-energy-card",
    name: "CustomEnergyCard",
    description: "Mein Testversuch!" // optional
});