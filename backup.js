/*import { html, LitElement, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";*/
import { html, LitElement, css } from "lit-element";
class CustomEnergyCard extends LitElement {

  // This will make parts of the card rerender when this.hass or this._config is changed.
  // this.hass is updated by Home Assistant whenever anything happens in your system.
  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }
  getCardSize() {
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    // This is actually optional. If not present, the cardHeight is assumed to be 1.
    return 3;
  }
  static get styles() {
    return css`
      .card {
        display: grid;
        grid-template-areas:
          ". solar ."
          "pv1 pv2 pv3"
          ". . ."
          "grid consumption battery";
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        align-items: center;
        justify-items: center;
        gap: 5%;
        width: 100%;
        height: 100%;
        padding: 2%;
      }
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border: 1px solid #ddd;
        height: 100%;
        width: 100%;
        background-color: grey
      }
      #solar {
        grid-area: solar;
      }
      #pv1 {
        grid-area: pv1;
      }
      #pv2 {
        grid-area: pv2;
      }
      #pv3 {
        grid-area: pv3;
      }
      #battery {
        grid-area: battery;
      }
      #grid {
        grid-area: grid;
      }
      /* Gestaltung */
      #consumption {
        grid-area: consumption;
        background-color: grey;
      }
      #solar, #pv1, #pv2, #pv3 {
        background-color: lightyellow;
      }
      #battery {
        background-color: lightskyblue;
      }
      #grid {
        background-color: lightgreen;
      }
      .box .state {
        font-size: 1.0em;
        font-weight: bold;
      }

    `;
  }
  setConfig(config) {
    if (!config.solar) {
      throw new Error('Solar fehlt');
    }
    else if (!config.pv1) {
      throw new Error('pv1 fehlt');
    }
    else if (!config.pv2) {
      throw new Error('pv2 fehlt');
    }
    else if (!config.pv3) {
      throw new Error('pv3 fehlt');
    }
    else if (!config.consumption) {
      throw new Error('consumption fehlt');
    }
    this._config = config;
  }

  // The render() function of a LitElement returns the HTML of your card, and any time one or the
  // properties defined above are updated, the correct parts of the rendered html are magically
  // replaced with the new values.  Check https://lit.dev for more info.
  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const solarState = this.hass.states[this._config.solar];
    const pv1State = this.hass.states[this._config.pv1];
    const pv2State = this.hass.states[this._config.pv2];
    const pv3State = this.hass.states[this._config.pv3];
    const consumptionState = this.hass.states[this._config.consumption];

    if (!solarState) {
      return html` <ha-card>Unknown Solar: ${this._config.solar}</ha-card> `;
    }

    // @click below is also LitElement magic
    return html`
        <ha-card style="padding:1em;">
          <div>
              <div class="card">
              <div class="box" id="solar">
                  <div>☀️ Solar</div>
                  <div class="state" id="solarState">${solarState.state}</div>
              </div>

              ${pv1State && pv1State.state
                ? html`
                  <div class="box" id="pv1">
                    <div>☀️ PV1</div>
                    <div class="state" id="pv1State">${pv1State ? pv1State.state : "N/A"}</div>
                    <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
                      <polyline id="connection-line-1" points="" stroke="black" stroke-width="2" fill="none" />
                    </svg>
                  </div>`
                : null
              }
              <div class="box" id="pv2">
                <div>☀️ PV2</div>
                <div class="state" id="pv3State">${pv2State ? pv2State.state : "N/A"}</div>
                
              </div>
              <div class="box" id="pv3">
                <div>☀️ PV3</div>
                <div class="state" id="pv3State">${pv3State ? pv3State.state : "N/A"}</div>
                <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
                  <polyline id="connection-line-2" points="" stroke="black" stroke-width="2" fill="none" />
                </svg>
              </div>
              <div class="box" id="grid"><div>Netz</div></div>
              <div class="box" id="consumption">
                  <div>⚡ Haus</div>
                  <div class="state" id="consumptionState">${consumptionState ? consumptionState.state : "N/A"}</div>
              </div>
          </div>
          <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
            <!-- Example polyline connecting boxes -->
            
            <polyline id="connection-line-2" points="" stroke="black" stroke-width="2" fill="none" />
          
          </svg>
          <div>
          reihe 2
          </div>
        </div>
      </ha-card>
    `;
  }

  firstUpdated() {
    this._updatePolyline();
  }
  updated() {
    this._updatePolyline();
  }
  _updatePolyline() {
    // Get references to the boxes
    const solarBox = this.shadowRoot.getElementById("solar");
    const pv1Box = this.shadowRoot.getElementById("pv1");
    const pv3Box = this.shadowRoot.getElementById("pv3");

    // Get the SVG polyline
    const polyline1 = this.shadowRoot.getElementById("connection-line-1");
    const polyline2 = this.shadowRoot.getElementById("connection-line-2");

    // Function to get the center of a box
    function getBox(box) {
      const rect = box.getBoundingClientRect();
      return {
        lx: rect.left,
        ly: rect.top + rect.height / 2,
        tx: rect.left + rect.width / 2,
        ty: rect.top,
        rx: rect.right,
        ry: rect.top + rect.height / 2,
        dx: rect.left + rect.width / 2,
        dy: rect.bottom,
      };
    }
    // Get the center of the Solar and PV1 boxes
    const solarPol = getBox(solarBox);
    const pv1Pol = getBox(pv1Box);
    const pv3Pol = getBox(pv3Box);

    // Create the right-angle points for the polyline
    const intermediateX1 = pv1Pol.tx; // Move horizontally to the same x-coordinate as PV1
    const intermediateY1 = solarPol.ly; // Keep the y-coordinate the same as Solar
    polyline1.setAttribute("points", `${solarPol.lx},${solarPol.ly} ${intermediateX1},${intermediateY1} ${pv1Pol.tx},${pv1Pol.ty}`);
    // Set the polyline points for a 90° connection from Solar to PV1

    const intermediateX2 = pv3Pol.tx; // Move horizontally to the same x-coordinate as PV1
    const intermediateY2 = solarPol.ly; // Keep the y-coordinate the same as Solar
    polyline2.setAttribute("points", `${solarPol.rx},${solarPol.ry} ${intermediateX2},${intermediateY2} ${pv3Pol.tx},${pv3Pol.ty}`);
    // Set the polyline points for a 90° connection from Solar to PV1
    
  }
}
customElements.define('custom-energy-card', CustomEnergyCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "custom-energy-card",
    name: "CustomEnergyCard",
    description: "Mein Testversuch!" // optional
});
