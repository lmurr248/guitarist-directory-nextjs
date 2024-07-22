import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

export default function MultiActionAreaCard({
  id,
  name,
  description,
  price,
  onSelect,
}) {
  function toSentenceCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3 }} onClick={() => onSelect(id)}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {toSentenceCase(name)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography
            variant="body2"
            color="#007fff"
            sx={{ fontWeight: 600, fontSize: 20, marginTop: 2 }}
          >
            {price}
          </Typography>
        </CardContent>

        <CardActions>
          <Button size="small" color="primary">
            Get {name} Listing
          </Button>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}
