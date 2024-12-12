import { css } from 'lit';

export default css`
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