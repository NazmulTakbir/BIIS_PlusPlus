import CustomButton from "../CustomButton/CustomButton";

const Buttons = (props) => {
  const { buttonList } = props.data;

  return (
    <td className="text-left">
      <div
        className="text-block"
        style={{
          margin: "auto",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-evenly",
          width: "90%",
        }}
      >
        {buttonList.map((button, buttonNo) => {
          return (
            <CustomButton
              key={buttonNo}
              label={button.buttonText}
              variant="contained"
              color={button.textColor}
              bcolor={button.backColor}
            />
          );
        })}
      </div>
    </td>
  );
};

export default Buttons;
