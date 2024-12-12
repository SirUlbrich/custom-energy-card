// energy-card-editor.js
import { css, html, LitElement } from 'lit';
export class EnergyCardEditor extends LitElement {
    static get properties() {
        return {
            // hass: {},
            _config: { state: true },
        };
    }

    setConfig(config) {
        this._config = config;
    }

    static styles = css`
            .table {
                display: table;
            }
            .row {
                display: table-row;
            }
            .cell {
                display: table-cell;
                padding: 0.5em;
            }
        `;

    render() {
        return html`
            <form class="table">
                <div class="row">
                    <label class="label cell" for="pv1">pv1:</label>
                    <input
                        @change="${this.handleChangedEvent}"
                        class="value cell" id="pv1" value="${this._config.pv1}"></input>
                </div>
                <div class="row">
                    <label class="label cell" for="pv2">pv2:</label>
                    <input
                        @change="${this.handleChangedEvent}"
                        class="value cell" id="pv2" value="${this._config.pv2}"></input>
                </div>
                <div class="row">
                    <label class="label cell" for="pv3">pv3:</label>
                    <input
                        @change="${this.handleChangedEvent}"
                        class="value cell" id="pv3" value="${this._config.pv3}"></input>
                </div>
                <div class="row">
                    <label class="label cell" for="consumption">consumption:</label>
                    <input
                        @change="${this.handleChangedEvent}"
                        class="value cell" id="consumption" value="${this._config.consumption}"></input>
                </div>
            </form>
        `;
    }
  
    handleChangedEvent(changedEvent) {
        // this._config is readonly, copy needed
        var newConfig = Object.assign({}, this._config);
        if (changedEvent.target.id == "pv1") {
            newConfig.pv1 = changedEvent.target.value;
        } else if (changedEvent.target.id == "pv2") {
            newConfig.pv2 = changedEvent.target.value;
        } else if (changedEvent.target.id == "pv3") {
            newConfig.pv3 = changedEvent.target.value;
        }else if (changedEvent.target.id == "consumption") {
            newConfig.consumption = changedEvent.target.value;
        }
        const messageEvent = new CustomEvent("config-changed", {
            detail: { config: newConfig },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(messageEvent);
    }
}
  
  