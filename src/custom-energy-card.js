/*import { html, LitElement, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";*/
import { html, LitElement, css } from "lit-element";
import styles from './custom-energy-card.styles'; 

export class CustomEnergyCard extends LitElement {

  _hass;
  
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
    return 6;
  }
  static get styles() {
    return styles;
  }

  setConfig(config) {
    if (!config.solar || !config.pv1 || !config.pv2 || !config.pv3 || !config.consumption) {
      throw new Error('Eine oder mehrere Entitäten fehlen');
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
                      <!-- Use writeCircleAndLine to create a connection between Solar and PV1 -->
                      ${this.htmlWriter.writeCircleAndLine(
                        'generation_to_pv1',
                        'M' +
                          (solarPosition.x - this.pxRate + gap) + ',' + solarPosition.y + 
                          'C' +
                          (solarPosition.x - this.pxRate + gap) + ',' +
                          (solarPosition.y + gap) + ' ' +
                          (solarPosition.x - this.pxRate + gap) + ',' +
                          (solarPosition.y + gap) + ' ' +
                          pv1Position.x + ',' + (pv1Position.y - gap)
                      )}
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
                  <polyline id="connection-line-2" points="" stroke="lightgrey" stroke-width="2" fill="none" />
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
            
            <polyline id="connection-line-2" points="" stroke="lightgrey" stroke-width="2" fill="none" />
          
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
  }S
  _updatePolyline() {
  // Get references to the boxesS
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
  const solarPosition = getBox(solarBox);
  const pv1Position = getBox(pv1Box);
  const pv3Position = getBox(pv3Box);
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
  static getConfigElement() {
    return document.createElement("energy-card-editor");
  } 

  static getStubConfig() {
    return {
      solar: "pv-total",
      pv1: "pv1",
      pv2: "pv2",
      pv3: "pv3",
      consumption: "hausverbrauch"
    }
  }
}