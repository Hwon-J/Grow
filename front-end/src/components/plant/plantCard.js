import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const PlantCard = (props) => {
  const data = props.props;

  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {data.plant_info}
        </Typography>
        <img src={`./plantimg/${data.imgname}.png`} alt="Home" />
        <Typography variant="h5" component="div">
          {data.plant_name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {data.child_name}
        </Typography>
        <Typography variant="body2">{data.difficulty}</Typography>
      </CardContent>
    </Card>
  );
};

export default PlantCard;
