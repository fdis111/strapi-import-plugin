/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import UploadFileForm from "../../components/UploadFileForm";
import {
  HeaderNav,
  LoadingIndicator,
  PluginHeader,
} from "strapi-helper-plugin";
import { request } from "strapi-helper-plugin";
import Row from "../../components/Row";
import Block from "../../components/Block";
import { Select, Label } from "@buffetjs/core";
import { get, has, isEmpty, pickBy, set } from "lodash";
import ExternalUrlForm from "../../components/ExternalUrlForm";
import RawInputForm from "../../components/RawInputForm";

const HomePage = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [importSource, setimportSource] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState([]);
  const [models, setmodels] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState("");
  const importSources = [
    { label: "External URL ", value: "url" },
    { label: "Upload file", value: "upload" },
    { label: "Raw text", value: "raw" },
  ];
  const selectImportDest = (selectedContentType) => {
    setSelectedContentType(selectedContentType);
  };
  const getModels = async () => {
    setLoading(true);
    try {
      const response = await request("/content-type-builder/content-types", {
        method: "GET",
      });

      // Remove non-user content types from models
      const models = get(response, ["data"], []).filter(
        (obj) => !has(obj, "plugin")
      );
      const modelOptions = models.map((model) => {
        return {
          label: get(model, ["schema", "name"], ""),
          value: model.uid,
        };
      });

      setLoading(false);

      return { models, modelOptions };
    } catch (e) {
      setLoading(false);
      strapi.notification.error(`${e}`);
    }
    return [];
  };
  const getUrl = (to) =>
    to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;
  const analyse = async (analysisConfig) => {
    try {
      const response = await request("/import-content/preAnalyzeImportFile", {
        method: "POST",
        body: analysisConfig,
      });
      setAnalysis(response);
      setAnalyzing(false);
      strapi.notification.success(`Analyzed Successfully`);
    } catch (e) {
      setAnalyzing(false);
      strapi.notification.error(`Analyze Failed, try again`);
      strapi.notification.error(`${e}`);
    }
  };

  const onRequestAnalysis = async (analysisConfig) => {
    // this.analysisConfig = analysisConfig;
    setAnalyzing(true);
    analyse(analysisConfig);
  };

  const selectImportSource = (importSource) => {
    setimportSource(importSource);
  };

  useEffect(() => {
    getModels().then((res) => {
      const { models, modelOptions } = res;
      setmodels(models);
      setModelOptions(modelOptions);
      setSelectedContentType(modelOptions ? modelOptions[0].value : "");
    });
  }, []);
  return (
    <div className={"container-fluid"} style={{ padding: "18px 30px" }}>
      <PluginHeader
        title={"Import Content"}
        description={"Import CSV and RSS-Feed into your Content Types"}
      />
      <HeaderNav
        links={[
          {
            name: "Import Data",
            to: getUrl(""),
          },
          {
            name: "Import History",
            to: getUrl("history"),
          },
        ]}
        style={{ marginTop: "4.4rem" }}
      />
      <div className="row">
        <Block
          title="General"
          description="Configure the Import Source & Destination"
          style={{ marginBottom: 12 }}
        >
          <Row className={"row"}>
            <div className={"col-4"}>
              <Label htmlFor="importSource">Import Source</Label>
              <Select
                name="importSource"
                options={importSources}
                value={importSource}
                onChange={({ target: { value } }) => selectImportSource(value)}
              />
            </div>
            <div className={"col-4"}>
              <Label htmlFor="importDest">Import Destination</Label>
              <Select
                value={selectedContentType}
                name="importDest"
                options={modelOptions}
                onChange={({ target: { value } }) => selectImportDest(value)}
              />
            </div>
          </Row>
          <Row>
            {importSource === "upload" && (
              <UploadFileForm
                onRequestAnalysis={onRequestAnalysis}
                loadingAnalysis={analyzing}
              />
            )}
            {importSource === "url" && (
              <ExternalUrlForm
                onRequestAnalysis={onRequestAnalysis}
                loadingAnalysis={analyzing}
              />
            )}
            {importSource === "raw" && (
              <RawInputForm
                onRequestAnalysis={onRequestAnalysis}
                loadingAnalysis={analyzing}
              />
            )}
          </Row>
        </Block>
      </div>
    </div>
  );
};

export default memo(HomePage);
