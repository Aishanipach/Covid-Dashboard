import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function Infobox({ title, cases, total }) {
  return (
    <Card>
      <CardContent>
        <Typography className="infoTitle" color="textSecondary">
          {title}
        </Typography>

        <h2 className="infoCases">{cases}</h2>

        <Typography className="infoTotal" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
