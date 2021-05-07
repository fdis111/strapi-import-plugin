import React, { useState } from "react";
import PropTypes from "prop-types";
import Row from "../Row";
import { Label, InputText } from "@buffetjs/core";
import { LoadingIndicator } from "strapi-helper-plugin";

const ExternalUrlForm = ({ onRequestAnalysis, loadingAnalysis }) => {
  const [url, setUrl] = useState("");

  const preAnalyzeImportFile = async (url) => {
    setUrl(url);
    onRequestAnalysis({ source: "url", options: { url } });
  };

  return (
    <Row>
      <Label message={"Import URL"} htmlFor={"urlInput"} />
      <InputText
        name={"urlInput"}
        placeholder={"https://www.nasa.gov/rss/dyn/educationnews.rss"}
        type={"url"}
        value={url}
        onChange={({ target: { value } }) => {
          this.preAnalyzeImportFile(value);
        }}
      />
      <Row>{loadingAnalysis && <LoadingIndicator />} </Row>
    </Row>
  );
};
ExternalUrlForm.propTypes = {
  onRequestAnalysis: PropTypes.func.isRequired,
  loadingAnalysis: PropTypes.bool.isRequired,
};

export default ExternalUrlForm;
