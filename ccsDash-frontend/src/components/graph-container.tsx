import * as React from "react";
import { useSelector } from "react-redux";
import { GraphingInputs } from "../models/graphing-model";
import { RootState } from "../store";
import "../components/common/css/graph-container.css";
import Divider from "@mui/material/Divider";

//import querystring from 'querystring';

const panelIds = {
  cfmPanel: "&panelId=4",
  cfmGraph: "&var-dataLimit=250&panelId=2",
  filterLifeGraph: "&var-dataLimit=250&panelId=8",
  tempGraph: "&var-dataLimit=250&panelId=7",
};

const GraphContainer = (props: any) => {
  const [cfmUrl, setCfmUrl] = React.useState("");
  const [enabled, setEnabled] = React.useState(false);
    const [graphStringCFM, setGraphCFM] = React.useState("");
    const [graphStringFilterLite, setGraphFilterLite] = React.useState("");
    const [graphStringTemp, setGraphTemp] = React.useState("");
  const graphingInputsData: GraphingInputs = useSelector(
    (state: RootState) => state.graphing.graphInputs
  );

  /* When graphing inputs are changed, useEffect */
  React.useEffect(() => {
    const tmpInputs: any = { ...graphingInputsData };
    //now we will have to convert the unit array
    // into a URL parameter acceptable by grafana
    // for multiple values.
    // grafana requires multiple values to contain
    // multiple values, repeated for the same variable
    tmpInputs.selectUnitId.forEach((u: string, idx: number) => {
      tmpInputs["var-unitIdSelect" + idx] = u;
    });
    //remove the selectUnitId array so it doesn't appear in the search parameters
    delete tmpInputs.selectUnitId;

    if (graphingInputsData.selectUnitId.length === 0) {
      setEnabled(false);
    } else {
      setEnabled(true);
      const searchParams = new URLSearchParams(tmpInputs);
      //now make the variables the same value
      // by stripping off the trailing number + '='
      // and replacing it with only '='
      const regex = /\d=/gm;
      const searchParams2 = searchParams.toString().replace(regex, "=");
    
      setCfmUrl(
        process.env.REACT_APP_GRAFANA_BASE_URL +
        searchParams2 +
        panelIds["cfmPanel"]
      );
      setGraphCFM(
        process.env.REACT_APP_GRAFANA_BASE_URL +
        searchParams2 +
        panelIds["cfmGraph"]
      );
      setGraphFilterLite(
        process.env.REACT_APP_GRAFANA_BASE_URL +
        searchParams2 +
        panelIds["filterLifeGraph"]
      );
       setGraphTemp(
         process.env.REACT_APP_GRAFANA_BASE_URL +
         searchParams2 +
         panelIds["tempGraph"]
       );
    }
  }, [graphingInputsData]);
  

  /* Page load useEffect */
  React.useEffect(() => {
    if (graphingInputsData.selectUnitId.length === 0) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, []);

  return (
    <>
      <div className={enabled === true ? "info-container" : "hide-graph"}>
      <iframe
          src={cfmUrl}
          width="600"
          height="300"
          title="cfmPanel"></iframe>

        <Divider variant="middle" className="marginDivider" />

        <iframe
          src={graphStringCFM}
          width="800"
          height="200px"
          title="cfmGraph"></iframe>

        <Divider variant="middle" className="marginDivider" />

        <iframe
          src={graphStringFilterLite}
          width="800"
          height="200px"
          title="filterLite"></iframe>

        <Divider variant="middle" className="marginDivider" />

        {/* <iframe
          src={graphStringTemp}
          width="800"
          height="132px"
          title="temperature"></iframe> */}

      </div>
      {graphingInputsData.selectUnitId.length === 0 && (
        <div className="info-container">
          <h2>
            To view CCS unit details, please select a unit from the left-hand
            side.
          </h2>
        </div>
      )}
    </>
  );
};

export default GraphContainer;
