import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const btnStyle = {
  bgcolor: "rgb(177, 49, 55)",
  color: "#fff",
  padding: "5px",
};

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid rgb(177, 49, 55)",
  boxShadow: 24,
  p: 4,
};

const SimpleModal = (props) => {
  const { buttonText, header, body } = props.data;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <td className="text-left">
      <div>
        <Button sx={btnStyle} onClick={handleOpen}>
          {buttonText}
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="modal-box" sx={boxStyle}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h6"
              sx={{ fontWeight: "bold", fontSize: "1rem" }}
            >
              {header}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: "15px" }}>
              {body}
            </Typography>
          </Box>
        </Modal>
      </div>
    </td>
  );
};

export default SimpleModal;
