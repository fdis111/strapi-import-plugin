import React, { useState } from "react";
import PropTypes from "prop-types";
import { Label, Select, Button, Textarea } from "@buffetjs/core";
import Row from "../Row";

const RawInputForm = ({ onRequestAnalysis, loadingAnalysis }) => {
  const dataFormats = [{ label: "csv", value: "text/csv" }];
  const [rawText, setrawText] = useState("");
  const [dataFormat, setDataFormat] = useState("text/csv");
  const textChanged = async (rawText) => {
    setrawText(rawText);
  };
  const changeDataFormat = (dataFormat) => {
    setDataFormat(dataFormat);
  };
  const analyze = () => {
    onRequestAnalysis({
      source: "raw",
      type: dataFormat,
      options: { rawText },
    });
  };

  return (
    <div className={"col-12"}>
      <Row className={"row"}>
        <Label message={"Data Format"} htmlFor={"dataFormats"} />
        <Select
          name={"dataFormats"}
          options={dataFormats}
          value={dataFormat}
          onChange={({ target: { value } }) => changeDataFormat(value)}
        />
      </Row>
      <Row className={"row"}>
        <Textarea
          name={"rawTextarea"}
          className={"col-12"}
          textStyle={{
            fontFamily: "monospace",
          }}
          value={rawText}
          onChange={({ target: { value } }) => {
            textChanged(value);
          }}
        />
      </Row>
      <Row className={"row"}>
        <Button label={"Analyze"} onClick={() => analyze()} />
      </Row>
    </div>
  );
};

RawInputForm.propTypes = {
  onRequestAnalysis: PropTypes.func.isRequired,
  loadingAnalysis: PropTypes.bool.isRequired,
};
export default RawInputForm;
