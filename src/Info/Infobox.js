import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./Infobox.css"
function Infobox({ title, cases, total,active, isRed, ...props }) {
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
      isRed && "infoBox--red"
    }`}>
      <CardContent>
        <Typography className="infoTitle" color="textSecondary">
          {title}
        </Typography>

        <h2 className={`infoCases ${!isRed && "infoCases--green"}`}>{cases}</h2>

        <Typography className="infoTotal" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
