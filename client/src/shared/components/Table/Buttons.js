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
              width="fit-content"
              color={button.textColor}
              bcolor={button.backColor}
              onClickFunction={button.onClickFunction}
              onClickArguments={button.onClickArguments}
            />
          );
        })}
      </div>
    </td>
  );
};

export default Buttons;
